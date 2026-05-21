/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Ortobom New Products Scraper — V1
 *
 * Estratégia:
 *   1. Busca todos os slugs de produtos existentes no banco de dados para evitar duplicados.
 *   2. Lê o sitemap oficial da Ortobom para descobrir as URLs base dos produtos.
 *   3. Filtra e deduplica as URLs do sitemap para obter apenas produtos novos.
 *   4. Inicializa o Puppeteer injetando cookies de geolocalização para revelar preços (São Paulo, SP).
 *   5. Executa a raspagem de cada produto novo sequentially, gravando o progresso em um arquivo JSON temporário.
 *   6. Suporta interrupção e retoma de onde parou.
 */

const puppeteer = require('c:/Users/lucas/IdeaProjects/ortobom-freelas/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const slugify = require('c:/Users/lucas/IdeaProjects/ortobom-freelas/node_modules/slugify');

const BASE_URL = 'https://www.ortobom.com.br';
const OUTPUT_FILE = path.join(__dirname, '../docs/novas-variantes-extraidas.json');
const TEMP_FILE = OUTPUT_FILE + '.tmp';
const SITEMAP_URL = 'https://www.ortobom.com.br/content/sitemap.xml';

// Slugs of products currently active in the database (we will fetch dynamically or hardcode if static,
// but since we want to be bulletproof, we will define them here based on our DB analysis)
const EXISTING_SLUGS = new Set([
  "colchao-fashion-standard",
  "colchao-orion",
  "base-sommier-bau-fashion-cori",
  "travesseiro-king-premium",
  "travesseiro-seis-estrelas",
  "base-sommier-orthopur",
  "base-sommier-pro-saude",
  "base-sommier-liberty",
  "cabeceira-lieve-cori",
  "colchao-orthopur",
  "colchao-pro-saude-nanolastic",
  "colchao-pro-saude-extra",
  "colchao-ortopedico-premium",
  "colchao-liberty",
  "colchao-absolut-hybrid",
  "colchao-pro-forca",
  "colchao-pro-saude-ortopedico",
  "colchao-pro-saude-superpocket",
  "colchao-ouro-spring",
  "base-sommier-bau-fashion-nobuck",
  "base-sommier-ouro-spring",
  "base-sommier-pro-forca",
  "base-sommier-orion",
  "base-sommier-bellona",
  "colchao-pro-saude-visco-adapt",
  "cabeceira-glamour-linho",
  "cabeceira-lovely-facto",
  "cabeceira-cherie-veludo",
  "cabeceira-cherie-linho",
  "travesseiro-royal-pillow",
  "travesseiro-sonho",
  "travesseiro-flock",
  "travesseiro-hug",
  "travesseiro-pro-latex-gel",
  "travesseiro-pluma-de-ganso",
  "tapete-de-yoga",
  "almofada-rolete-nobuck",
  "colchonete-all-day",
  "encosto-dino-veludo",
  "colchonete-small-para-academia",
  "suavencosto-infantil",
  "massageador-alveolado",
  "suavencosto-alveolado",
  "sofa-cama-2l-veludo-azul-marinho",
  "poltrona-reclinavel-ortobom-cori",
  "sofa-cama-3l-linho-bege",
  "poltrona-reclinavel-ortobom-nobuck",
  "cabeceira-lieve-facto",
  "cabeceira-glamour-veludo",
  "travesseiro-pro-latex",
  "travesseiro-viscopur-gel",
  "travesseiro-conforto-regulavel",
  "travesseiro-viscopur",
  "colchonete-big-para-academia",
  "sofa-cama-2l-linho-cinza",
  "sofa-cama-3l-veludo-azul-marinho",
  "poltrona-massageadora-ortobom-cori",
  "poltrona-reclinavel-ortobom-premium-nobuck"
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeSlug(name) {
  return slugify(name, { lower: true, strict: true, locale: 'pt' });
}

function fetchSitemap() {
  return new Promise((resolve, reject) => {
    console.log(`📡 Buscando sitemap de ${SITEMAP_URL}...`);
    https.get(SITEMAP_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', (err) => { reject(err); });
  });
}

function parseProductUrlsFromSitemap(xml) {
  const regex = /<loc>(https:\/\/www\.ortobom\.com\.br\/[^<]+)<\/loc>/g;
  let match;
  const urls = [];
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  // Filtra apenas links de produto (/p/)
  const productUrls = urls.filter(url => url.includes('/p/'));
  
  // Deduplica e extrai as URLs base
  const baseUrls = new Set();
  for (const url of productUrls) {
    const parts = url.split('/');
    if (parts.length >= 6) {
      // https://www.ortobom.com.br/p/[categoria]/[slug]
      const basePath = parts.slice(0, 6).join('/');
      baseUrls.add(basePath);
    }
  }

  return Array.from(baseUrls);
}

// Mapeia a categoria com base no caminho da URL ou nome
function getCategoryFromUrl(urlPath) {
  const lowercase = urlPath.toLowerCase();
  if (lowercase.includes('/colchao')) return 'colchoes';
  if (lowercase.includes('/cama')) return 'camas';
  if (lowercase.includes('/cabeceira')) return 'cabeceiras';
  if (lowercase.includes('/travesseiro')) return 'travesseiros';
  if (lowercase.includes('/acessorios') || lowercase.includes('/roupa-de-cama')) return 'acessorios';
  if (lowercase.includes('/moveis')) return 'moveis';
  return 'acessorios'; // default fallback
}

async function scrape() {
  console.log('🚀 Inicializando Ortobom New Products Scraper...');
  
  // 1. Carrega ou cria progresso temporário
  let outputData = { products: [] };
  const scrapedUrls = new Set();
  
  if (fs.existsSync(TEMP_FILE)) {
    try {
      outputData = JSON.parse(fs.readFileSync(TEMP_FILE, 'utf8'));
      outputData.products.forEach(p => {
        if (p.original_url) scrapedUrls.add(p.original_url);
      });
      console.log(`ℹ️ Retomando raspagem anterior. ${scrapedUrls.size} produtos já processados.`);
    } catch (e) {
      console.warn('⚠️ Erro ao ler arquivo temporário. Iniciando do zero.');
    }
  }

  // 2. Busca e parseia o sitemap
  let baseUrls = [];
  try {
    const xml = await fetchSitemap();
    baseUrls = parseProductUrlsFromSitemap(xml);
    console.log(`✅ Sitemap carregado. Total de produtos únicos no site: ${baseUrls.length}`);
  } catch (e) {
    console.error('❌ Falha crítica ao buscar o sitemap:', e.message);
    process.exit(1);
  }

  // 3. Filtra produtos que já existem no banco de dados ou que já foram raspados nesta sessão
  const newProductUrls = baseUrls.filter(url => {
    // Evita os já raspados nesta execução
    if (scrapedUrls.has(url)) return false;

    // Filtra comparando o slug da URL com os existentes no banco
    const parts = url.split('/');
    const slugInUrl = parts[5];
    
    let isExisting = false;
    if (EXISTING_SLUGS.has(slugInUrl)) {
      isExisting = true;
    } else {
      for (const existingSlug of EXISTING_SLUGS) {
        if (slugInUrl === existingSlug || slugInUrl.startsWith(existingSlug + '-') || existingSlug.startsWith(slugInUrl + '-')) {
          isExisting = true;
          break;
        }
      }
    }
    return !isExisting;
  });

  console.log(`📦 Produtos novos a raspar nesta sessão: ${newProductUrls.length}`);

  if (newProductUrls.length === 0) {
    console.log('✅ Nenhum produto novo encontrado para processar.');
    // Se havia um arquivo temporário completo, move
    if (fs.existsSync(TEMP_FILE)) {
      fs.renameSync(TEMP_FILE, OUTPUT_FILE);
    }
    process.exit(0);
  }

  // 4. Inicializa o Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  // Injeta cookies de geolocalização (São Paulo, SP) para habilitar preços e variantes
  const domain = '.ortobom.com.br';
  await page.setCookie(
    { name: 'locationCidade', value: '9668', domain: domain, path: '/' },
    { name: 'locationGeoposition', value: '7712302', domain: domain, path: '/' }
  );

  // 5. Itera pelos novos produtos
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < newProductUrls.length; i++) {
    const url = newProductUrls[i];
    const indexStr = `[${i + 1}/${newProductUrls.length}]`;
    console.log(`\n${indexStr} Acessando: ${url}`);

    try {
      const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      
      // Verifica redirecionamento para página não encontrada (404)
      const currentUrl = page.url();
      if (currentUrl.includes('PaginaNaoEncontrada') || response.status() >= 400) {
        console.warn(`⚠️ Página não encontrada (404): ${url}`);
        const parts = url.split('/');
        outputData.products.push({
          slug: parts[5] || 'desconhecido',
          error: 'Página retornou 404',
          original_url: url
        });
        failCount++;
        
        // Grava progresso temporário
        fs.writeFileSync(TEMP_FILE, JSON.stringify(outputData, null, 2));
        continue;
      }

      await sleep(2000); // Aguarda renderização adicional do JS

      // Extração de dados da página
      const scrapedData = await page.evaluate(() => {
        // Nome
        const nameEl = document.querySelector('h1') || document.querySelector('.product-name') || document.querySelector('.product-title');
        const name = nameEl ? nameEl.innerText.trim() : '';

        if (!name) {
          return { error: 'Nome do produto não encontrado' };
        }

        // Descrição (evita pegar tags <meta itemprop="description"> que não contêm o texto visível)
        const descEl =
          document.querySelector('#descricaoDetalhadaFull') ||
          document.querySelector('#product-detailed-description') ||
          document.querySelector('.product-description') ||
          document.querySelector('#descricaoResumida') ||
          document.querySelector('#descricaoBreve');
        const description = descEl ? descEl.innerText.trim() : '';
        const descriptionHtml = descEl ? descEl.innerHTML.trim() : '';

        // Imagens
        const imageUrls = new Set();
        const imgSelectors = [
          '.splide__slide img',
          '.splide__list img',
          '[class*="thumb"] img',
          '[class*="thumbnail"] img',
          '[class*="gallery"] img',
          '[class*="produto-fotos"] img',
        ];
        imgSelectors.forEach((sel) => {
          document.querySelectorAll(sel).forEach((img) => {
            const src = (img.dataset.src || img.src || '').split('?')[0];
            if (src && src.includes('cdn.ortobom.com.br')) imageUrls.add(src);
          });
        });

        if (imageUrls.size === 0) {
          document.querySelectorAll('img').forEach((img) => {
            const src = (img.dataset.src || img.src || '').split('?')[0];
            if (src && src.includes('cdn.ortobom.com.br')) imageUrls.add(src);
          });
        }

        const images = Array.from(imageUrls);
        const featuredImage = images[0] || '';

        // Preço sugerido "de" (compare_at_price)
        const compareEl =
          document.querySelector('#precoSugeridoProduto') ||
          document.querySelector('.oldPrice') ||
          document.querySelector('[class*="price-old"]');
        const compareRaw = compareEl?.innerText?.replace(/[^\d,]/g, '').replace(',', '.') || '';
        const compareAtPrice = parseFloat(compareRaw) || null;

        // Variantes (tamanhos)
        const variants = [];
        const sizeOpts = document.querySelectorAll('.sizeOpts');

        if (sizeOpts.length > 0) {
          sizeOpts.forEach((opt) => {
            const sizeEl = opt.querySelector('p');
            const dimEl = opt.querySelector('small');
            const priceEl = opt.querySelector('div');

            const size = sizeEl ? sizeEl.innerText.trim() : '';
            if (!size || size === 'Sob medida') return; // ignora Sob medida

            const dimensions = dimEl ? dimEl.innerText.replace(' cm', '').trim() : '';

            // Se for o card ativo (não tem preço listado no próprio card, puxa o principal)
            const isActive = opt.classList.contains('active');
            let price = 0;
            if (isActive) {
              const activePriceEl = document.querySelector('#precoAVistaProduto') || document.querySelector('.newPrice');
              const priceRaw = activePriceEl ? activePriceEl.innerText.replace(/[^\d,]/g, '').replace(',', '.') : '0';
              price = parseFloat(priceRaw) || 0;
            } else {
              const priceRaw = priceEl ? priceEl.innerText.replace(/[^\d,]/g, '').replace(',', '.') : '0';
              price = parseFloat(priceRaw) || 0;
            }

            variants.push({
              size,
              dimensions,
              price
            });
          });
        } else {
          // Única variante Padrão
          const priceEl = document.querySelector('#precoAVistaProduto') || document.querySelector('.newPrice');
          const priceRaw = priceEl ? priceEl.innerText.replace(/[^\d,]/g, '').replace(',', '.') : '0';
          const price = parseFloat(priceRaw) || 0;

          variants.push({
            size: 'Padrão',
            dimensions: '',
            price
          });
        }

        return {
          name,
          description,
          descriptionHtml,
          featuredImage,
          images,
          compareAtPrice,
          variants
        };
      });

      if (scrapedData.error) {
        throw new Error(scrapedData.error);
      }

      // Segunda validação de segurança contra duplicados baseados no slug gerado pelo nome real
      const finalSlug = makeSlug(scrapedData.name);
      if (EXISTING_SLUGS.has(finalSlug)) {
        console.log(`ℹ️ Ignorando ${scrapedData.name} (já existe no banco via slug real).`);
        continue;
      }

      // Formata variantes de acordo com o padrão exigido
      const formattedVariants = scrapedData.variants.map(v => ({
        size: v.size,
        dimensions: v.dimensions,
        price: v.price,
        compare_at_price: scrapedData.compareAtPrice && scrapedData.compareAtPrice > v.price ? scrapedData.compareAtPrice : null
      }));

      // Adiciona o produto mapeado ao payload de saída
      outputData.products.push({
        name: scrapedData.name,
        slug: finalSlug,
        description: scrapedData.description,
        description_html: scrapedData.descriptionHtml,
        featured_image: scrapedData.featuredImage,
        images: scrapedData.images,
        compare_at_price_base: scrapedData.compareAtPrice,
        category_slug: getCategoryFromUrl(url),
        original_url: url,
        variants: formattedVariants
      });

      console.log(`✅ Raspado com sucesso: "${scrapedData.name}" (${formattedVariants.length} variantes).`);
      successCount++;

    } catch (err) {
      console.error(`❌ Erro ao raspar ${url}:`, err.message);
      const parts = url.split('/');
      outputData.products.push({
        slug: parts[5] || 'erro-desconhecido',
        error: err.message,
        original_url: url
      });
      failCount++;
    }

    // Grava progresso no arquivo temporário para resiliência
    fs.writeFileSync(TEMP_FILE, JSON.stringify(outputData, null, 2));

    // Delay educado (1.5s a 2.5s)
    const delay = 1500 + Math.random() * 1000;
    await sleep(delay);
  }

  await browser.close();

  // 6. Conclusão e renomeação do arquivo final
  if (fs.existsSync(TEMP_FILE)) {
    fs.renameSync(TEMP_FILE, OUTPUT_FILE);
  }

  console.log('\n========================================');
  console.log('🎉 RASPAGEM DE NOVOS PRODUTOS CONCLUÍDA!');
  console.log(`- Sucessos: ${successCount}`);
  console.log(`- Falhas/Erros: ${failCount}`);
  console.log(`- Arquivo gerado com sucesso em: ${OUTPUT_FILE}`);
  console.log('========================================');
}

scrape().catch((e) => {
  console.error('❌ Falha grave na execução:', e);
  process.exit(1);
});
