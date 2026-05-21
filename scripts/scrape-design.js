/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Ortobom Design Scraper
 *
 * Captura, para uma lista de páginas alvo do site ortobom.com.br:
 *  - HTML bruto e renderizado
 *  - Screenshots full-page (desktop + mobile)
 *  - Todos os arquivos CSS linkados (baixados localmente)
 *  - Estilos `<style>` inline concatenados
 *  - Estilos computados de elementos-chave (header, footer, hero, etc.)
 *  - Paleta de cores em uso
 *  - Famílias de fontes em uso
 *  - Metadados (title/description/og)
 *
 * Uso: node scripts/scrape-design.js
 *
 * Saída: scripts/design-scrape/<slug>/
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// ────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────
const BASE_URL = 'https://www.ortobom.com.br';
const OUTPUT_ROOT = path.join(__dirname, 'design-scrape');

const TARGET_PAGES = [
    { slug: 'home', url: BASE_URL },
    { slug: 'plp-colchoes-solteiro', url: `${BASE_URL}/cat/colchao/solteiro/` },
    { slug: 'plp-colchoes-solteiro-extra', url: `${BASE_URL}/cat/colchao/solteiro-extra/` },
    { slug: 'plp-colchoes-casal', url: `${BASE_URL}/cat/colchao/casal/` },
    { slug: 'plp-colchoes-queen', url: `${BASE_URL}/cat/colchao/queen/` },
    { slug: 'plp-colchoes-king', url: `${BASE_URL}/cat/colchao/king/` },
    { slug: 'plp-bases-solteiro', url: `${BASE_URL}/cat/base/solteiro/` },
    { slug: 'plp-bases-casal', url: `${BASE_URL}/cat/base/casal/` },
    { slug: 'plp-bases-queen', url: `${BASE_URL}/cat/base/queen/` },
    { slug: 'plp-bases-king', url: `${BASE_URL}/cat/base/king/` },
    { slug: 'plp-cabeceiras-casal', url: `${BASE_URL}/cat/cabeceira/casal/` },
    { slug: 'plp-cabeceiras-queen', url: `${BASE_URL}/cat/cabeceira/queen/` },
    { slug: 'plp-cabeceiras-king', url: `${BASE_URL}/cat/cabeceira/king/` },
    { slug: 'plp-travesseiros', url: `${BASE_URL}/travesseiros` },
    { slug: 'plp-acessorios', url: `${BASE_URL}/acessorios` },
    { slug: 'plp-moveis', url: `${BASE_URL}/moveis` },
    // PDP é descoberta dinamicamente abaixo (primeiro produto da PLP de colchões)
];

const VIEWPORTS = {
    desktop: { width: 1440, height: 900 },
    mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};

const SECTIONS_TO_INSPECT = [
    { key: 'header', selectors: ['header', '[class*="header"]', '[class*="Header"]'] },
    { key: 'top-bar', selectors: ['[class*="topbar"]', '[class*="top-bar"]', '[class*="announcement"]'] },
    { key: 'main-nav', selectors: ['nav', '[class*="navbar"]', '[class*="menu"]'] },
    { key: 'search-input', selectors: ['input[type="search"]', 'input[placeholder*="buscar" i]', 'input[name="q"]'] },
    { key: 'hero', selectors: ['[class*="hero"]', '[class*="banner"]', '.splide', '[class*="slider"]'] },
    { key: 'category-grid', selectors: ['[class*="categories"]', '[class*="categoria"]', '[class*="category-grid"]'] },
    { key: 'product-card', selectors: ['[class*="product-card"]', '[class*="ProductCard"]', '[class*="card-produto"]', 'article'] },
    { key: 'cta-button', selectors: ['button[class*="primary"]', '[class*="btn-primary"]', '[class*="cta"]', 'a[class*="button"]'] },
    { key: 'footer', selectors: ['footer', '[class*="footer"]', '[class*="Footer"]'] },
];

const COMPUTED_PROPS = [
    'background-color', 'background-image', 'color',
    'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform',
    'padding', 'margin', 'gap',
    'border', 'border-radius', 'box-shadow',
    'display', 'flex-direction', 'justify-content', 'align-items',
    'width', 'height', 'max-width',
    'position', 'top', 'z-index',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ────────────────────────────────────────────
// Utilities
// ────────────────────────────────────────────
function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function safeFilename(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(dest);
        client
            .get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
                if (res.statusCode >= 400) {
                    file.close();
                    fs.unlink(dest, () => {});
                    return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
                }
                res.pipe(file);
                file.on('finish', () => file.close(() => resolve(dest)));
            })
            .on('error', (err) => {
                file.close();
                fs.unlink(dest, () => {});
                reject(err);
            });
    });
}

function rgbToHex(rgb) {
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return rgb;
    const [, r, g, b, a] = m;
    const hex =
        '#' +
        [r, g, b]
            .map((n) => Number(n).toString(16).padStart(2, '0'))
            .join('');
    if (a !== undefined && Number(a) < 1) return `${hex} (alpha ${a})`;
    return hex;
}

// ────────────────────────────────────────────
// Page-level scraping
// ────────────────────────────────────────────
async function scrapePage(browser, target) {
    const pageDir = path.join(OUTPUT_ROOT, target.slug);
    ensureDir(pageDir);
    ensureDir(path.join(pageDir, 'css'));
    ensureDir(path.join(pageDir, 'computed'));

    console.log(`\n📄 ${target.slug}  →  ${target.url}`);

    const page = await browser.newPage();
    await page.setViewport(VIEWPORTS.desktop);
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Coletar resposta de stylesheets via network
    const stylesheetResponses = new Map();
    page.on('response', async (response) => {
        const reqUrl = response.url();
        const ct = response.headers()['content-type'] || '';
        if (ct.includes('text/css') || reqUrl.endsWith('.css')) {
            try {
                const body = await response.text();
                stylesheetResponses.set(reqUrl, body);
            } catch (_) {
                // ignore
            }
        }
    });

    try {
        await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch (e) {
        console.warn(`   ⚠️  networkidle2 timeout, continuando: ${e.message}`);
    }
    await sleep(1500);

    // Scroll para garantir lazy-load
    await autoScroll(page);
    await sleep(500);

    // ── HTML ────────────────────────────────────────────
    const rawHtml = await page.content();
    fs.writeFileSync(path.join(pageDir, 'page.html'), rawHtml);

    // ── Metadados ───────────────────────────────────────
    const meta = await page.evaluate(() => {
        const get = (sel, attr = 'content') => document.querySelector(sel)?.getAttribute(attr) || '';
        return {
            url: location.href,
            title: document.title,
            description: get('meta[name="description"]'),
            keywords: get('meta[name="keywords"]'),
            viewport: get('meta[name="viewport"]'),
            og: {
                title: get('meta[property="og:title"]'),
                description: get('meta[property="og:description"]'),
                image: get('meta[property="og:image"]'),
                type: get('meta[property="og:type"]'),
            },
            lang: document.documentElement.lang,
            charset: document.characterSet,
        };
    });
    fs.writeFileSync(path.join(pageDir, 'meta.json'), JSON.stringify(meta, null, 2));

    // ── Stylesheets linkados + inline ────────────────────
    const styleInfo = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .map((l) => l.href)
            .filter(Boolean);
        const inline = Array.from(document.querySelectorAll('style')).map((s) => s.textContent || '');
        return { links, inline };
    });

    // Salva inline styles concatenados
    if (styleInfo.inline.length > 0) {
        const concatInline = styleInfo.inline
            .map((css, i) => `/* === inline <style> #${i + 1} === */\n${css}`)
            .join('\n\n');
        fs.writeFileSync(path.join(pageDir, 'inline-styles.css'), concatInline);
    }

    // Baixa cada stylesheet (preferindo o body já capturado pela network)
    const cssIndex = [];
    for (const cssUrl of styleInfo.links) {
        try {
            let body = stylesheetResponses.get(cssUrl);
            const filename = safeFilename(new URL(cssUrl).pathname.split('/').pop() || 'style.css');
            const dest = path.join(pageDir, 'css', filename);
            if (body) {
                fs.writeFileSync(dest, body);
            } else {
                await downloadFile(cssUrl, dest);
            }
            cssIndex.push({ url: cssUrl, file: `css/${filename}` });
        } catch (e) {
            console.warn(`   ⚠️  CSS falhou ${cssUrl}: ${e.message}`);
            cssIndex.push({ url: cssUrl, file: null, error: e.message });
        }
    }
    fs.writeFileSync(path.join(pageDir, 'css', 'index.json'), JSON.stringify(cssIndex, null, 2));

    // ── Computed styles por seção ───────────────────────
    for (const section of SECTIONS_TO_INSPECT) {
        const result = await page.evaluate(
            (selectors, props) => {
                let el = null;
                let usedSelector = null;
                for (const sel of selectors) {
                    const found = document.querySelector(sel);
                    if (found) {
                        el = found;
                        usedSelector = sel;
                        break;
                    }
                }
                if (!el) return null;

                const cs = window.getComputedStyle(el);
                const styles = {};
                for (const p of props) styles[p] = cs.getPropertyValue(p);

                const rect = el.getBoundingClientRect();
                return {
                    selector: usedSelector,
                    tagName: el.tagName.toLowerCase(),
                    classes: el.className?.toString?.() || '',
                    id: el.id || '',
                    dimensions: {
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        left: rect.left,
                    },
                    styles,
                    outerHtmlSnippet: el.outerHTML.slice(0, 4000),
                };
            },
            section.selectors,
            COMPUTED_PROPS
        );
        if (result) {
            fs.writeFileSync(
                path.join(pageDir, 'computed', `${section.key}.json`),
                JSON.stringify(result, null, 2)
            );
        }
    }

    // ── Paleta de cores + fontes (varredura global) ─────
    const designTokens = await page.evaluate(() => {
        const colors = new Map();
        const fonts = new Map();
        const radii = new Map();
        const shadows = new Map();

        const all = document.querySelectorAll('*');
        const sample = Array.from(all).slice(0, 4000); // limita pra não travar

        for (const el of sample) {
            const cs = window.getComputedStyle(el);
            const props = ['color', 'background-color', 'border-color', 'border-top-color', 'fill'];
            for (const p of props) {
                const v = cs.getPropertyValue(p);
                if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') {
                    colors.set(v, (colors.get(v) || 0) + 1);
                }
            }
            const ff = cs.getPropertyValue('font-family');
            if (ff) fonts.set(ff, (fonts.get(ff) || 0) + 1);

            const br = cs.getPropertyValue('border-radius');
            if (br && br !== '0px') radii.set(br, (radii.get(br) || 0) + 1);

            const sh = cs.getPropertyValue('box-shadow');
            if (sh && sh !== 'none') shadows.set(sh, (shadows.get(sh) || 0) + 1);
        }

        const sortedEntries = (m) =>
            Array.from(m.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([value, count]) => ({ value, count }));

        return {
            colors: sortedEntries(colors),
            fonts: sortedEntries(fonts),
            borderRadius: sortedEntries(radii),
            boxShadow: sortedEntries(shadows),
        };
    });

    // Adiciona hex para cores
    designTokens.colors = designTokens.colors.map((c) => ({
        ...c,
        hex: rgbToHex(c.value),
    }));
    fs.writeFileSync(path.join(pageDir, 'design-tokens.json'), JSON.stringify(designTokens, null, 2));

    // ── Screenshots ─────────────────────────────────────
    await page.setViewport(VIEWPORTS.desktop);
    await page.screenshot({
        path: path.join(pageDir, 'screenshot-desktop.png'),
        fullPage: true,
    });
    console.log(`   📸 desktop full-page`);

    await page.setViewport(VIEWPORTS.mobile);
    await sleep(800);
    await page.screenshot({
        path: path.join(pageDir, 'screenshot-mobile.png'),
        fullPage: true,
    });
    console.log(`   📸 mobile full-page`);

    // ── Lista de imagens da página ─────────────────────
    const images = await page.evaluate(() =>
        Array.from(document.querySelectorAll('img'))
            .map((img) => ({
                src: (img.currentSrc || img.src || '').split('?')[0],
                alt: img.alt || '',
                width: img.naturalWidth,
                height: img.naturalHeight,
            }))
            .filter((i) => i.src)
    );
    fs.writeFileSync(path.join(pageDir, 'images.json'), JSON.stringify(images, null, 2));

    await page.close();

    return {
        slug: target.slug,
        url: target.url,
        title: meta.title,
        cssCount: cssIndex.length,
        imagesCount: images.length,
        topColors: designTokens.colors.slice(0, 5).map((c) => c.hex),
        topFonts: designTokens.fonts.slice(0, 3).map((f) => f.value),
    };
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let total = 0;
            const distance = 500;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                total += distance;
                if (total >= document.body.scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    window.scrollTo(0, 0);
                    resolve();
                }
            }, 250);
        });
    });
}

// ────────────────────────────────────────────
// Discover one PDP from PLP de colchões
// ────────────────────────────────────────────
async function discoverPdp(browser) {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORTS.desktop);
    try {
        await page.goto(`${BASE_URL}/colchoes`, { waitUntil: 'networkidle2', timeout: 60000 });
        await sleep(2000);
        const link = await page.evaluate(() => {
            const a = document.querySelector('a[href*="/p/"]');
            return a ? a.href : null;
        });
        await page.close();
        return link;
    } catch (e) {
        console.warn('Não foi possível descobrir PDP:', e.message);
        await page.close();
        return null;
    }
}

// ────────────────────────────────────────────
// Main
// ────────────────────────────────────────────
async function run() {
    console.log('🚀 Ortobom Design Scraper\n');
    ensureDir(OUTPUT_ROOT);

    // CLI: --only=pdp,home  → roda apenas slugs específicos
    const args = process.argv.slice(2);
    const onlyArg = args.find((a) => a.startsWith('--only='));
    const only = onlyArg ? onlyArg.split('=')[1].split(',').map((s) => s.trim()) : null;

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    // Adiciona um PDP descoberto dinamicamente
    const pdpUrl = await discoverPdp(browser);
    const pages = [...TARGET_PAGES];
    if (pdpUrl) {
        pages.push({ slug: 'pdp-amostra', url: pdpUrl });
        console.log(`   PDP descoberto: ${pdpUrl}`);
    }

    const filtered = only ? pages.filter((p) => only.includes(p.slug)) : pages;
    if (only && filtered.length === 0) {
        console.warn(`Nenhum slug bateu com --only=${only.join(',')}. Slugs disponíveis: ${pages.map((p) => p.slug).join(', ')}`);
    }

    const summary = [];
    for (const target of filtered) {
        try {
            const result = await scrapePage(browser, target);
            summary.push(result);
            await sleep(800);
        } catch (e) {
            console.error(`❌ Falha em ${target.slug}: ${e.message}`);
            summary.push({ slug: target.slug, url: target.url, error: e.message });
        }
    }

    // Merge com summary existente (caso rodando --only)
    const summaryPath = path.join(OUTPUT_ROOT, 'summary.json');
    let merged = summary;
    if (only && fs.existsSync(summaryPath)) {
        try {
            const prev = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
            const slugsNow = new Set(summary.map((s) => s.slug));
            merged = [...prev.filter((s) => !slugsNow.has(s.slug)), ...summary];
        } catch (_) {
            // ignore
        }
    }
    fs.writeFileSync(summaryPath, JSON.stringify(merged, null, 2));

    // README com resumo amigável (regenerado sempre, com base no merged)
    const readme = [
        '# Ortobom — Captura de Design',
        '',
        `Gerado em: ${new Date().toISOString()}`,
        '',
        '## Páginas capturadas',
        '',
        ...merged.map((s) =>
            s.error
                ? `- ❌ \`${s.slug}\` — ${s.url} — ERRO: ${s.error}`
                : `- ✅ \`${s.slug}\` — [${s.title}](${s.url}) — ${s.cssCount} CSS, ${s.imagesCount} imagens`
        ),
        '',
        '## Estrutura por página',
        '',
        '```',
        '<slug>/',
        '  page.html              # HTML pós-render (depois de JS executar)',
        '  inline-styles.css      # blocos <style> inline concatenados',
        '  meta.json              # title, description, og tags',
        '  design-tokens.json     # cores, fontes, radii, shadows mais usados',
        '  images.json            # lista de <img> com src/alt/dimensões',
        '  screenshot-desktop.png # full page 1440x900',
        '  screenshot-mobile.png  # full page 390x844',
        '  css/',
        '    *.css                # cada stylesheet linkado, baixado',
        '    index.json           # mapa url → arquivo local',
        '  computed/',
        '    header.json          # estilos computados do header',
        '    footer.json          # idem footer',
        '    hero.json, ...       # idem demais seções',
        '```',
        '',
        '> Estes arquivos servem como referência educativa para implementação de uma cópia visual.',
        '> Não redistribuir o conteúdo capturado.',
        '',
    ].join('\n');
    fs.writeFileSync(path.join(OUTPUT_ROOT, 'README.md'), readme);

    await browser.close();
    console.log(`\n✅ Concluído. Saída: ${OUTPUT_ROOT}`);
}

run().catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
});
