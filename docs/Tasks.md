# Detalhamento de Tarefas e Critérios de Aceitação

Este documento detalha as User Stories com seus critérios de aceitação específicos e tarefas técnicas necessárias para a implementação.

---

## Épico 1: Experiência de Navegação (Vitrine)

### US-01: Slider de Promoções na Home
**História:** Como cliente, quero visualizar um slider com promoções na página inicial, para saber das melhores ofertas imediatamente.

**Critérios de Aceitação:**
- [x] O slider deve ocupar a largura total (full-width) ou destaque significativo no topo da Home.
- [x] Deve conter pelo menos 3 banners rotativos.
- [x] Deve haver setas de navegação (anterior/próximo) e indicadores de página (bolinhas).
- [x] O slider deve pausar a rotação automática ao passar o mouse (desktop) ou tocar (mobile).
- [x] Em mobile, deve suportar gestos de "swipe".

**Tarefas Técnicas:**
- Implementar componente `HeroSlider` usando `Embla Carousel`.
- Criar config ou tabela no banco para gerenciar as imagens e links dos banners.

### US-02: Categorias em Destaque
**História:** Como cliente, quero ver categorias em destaque, para navegar rapidamente para o tipo de produto que desejo.

**Critérios de Aceitação:**
- [x] Exibir cards ou ícones circulares com as principais categorias (ex: Colchões, Camas, Travesseiros).
- [x] Ao clicar em uma categoria, redirecionar para uma página de listagem filtrada ou seção específica.
- [x] Deve ser responsivo (grid ajustável: 2 por linha em mobile, 4+ em desktop).

**Tarefas Técnicas:**
- Criar componente `CategoryGrid`.
- Buscar categorias ativas da tabela `categories` no Supabase.

### US-03: Busca de Produtos
**História:** Como cliente, quero buscar produtos por nome, para encontrar um item específico.

**Critérios de Aceitação:**
- [x] Campo de busca visível no Header.
- [ ] Ao digitar e dar "Enter" (ou clicar na lupa), redirecionar para página de resultados.
- [ ] Se nenhum produto for encontrado, exibir mensagem amigável ("Nenhum produto encontrado...").
- [ ] A busca deve ser *case-insensitive* e parcial (ex: "free" acha "Freedom").

**Tarefas Técnicas:**
- Criar componente `SearchBar`.
- Implementar query lógica no Supabase (`ilike` search).

### US-04: Filtros de Produto (PLP)
**História:** Como cliente, quero filtrar produtos por categoria, preço e tamanho, para refinar minha busca.

**Critérios de Aceitação:**
- [ ] Sidebar (desktop) ou Drawer (mobile) via *Sheet* component (Shadcn/ui pattern).
- [ ] Filtro de Preço: Inputs numéricos de "Mínimo" e "Máximo".
- [ ] Filtro de Categoria: Checkboxes.
- [ ] A listagem de produtos deve atualizar sem recarregar a página (AJAX/Router refresh) ou de forma rápida.
- [ ] Botão de "Limpar Filtros".

**Tarefas Técnicas:**
- Criar estado global ou via URL Params para os filtros (melhor para compartilhamento de link).
- Implementar query dinâmica no Supabase combinando cláusulas `WHERE`.

---

## Épico 2: Detalhes do Produto & Variações

### US-05: Galeria de Imagens (PDP)
**História:** Como cliente, quero ver fotos detalhadas do produto, para avaliar a qualidade.

**Critérios de Aceitação:**
- [x] Imagem principal em destaque e carrossel de miniaturas abaixo/lado.
- [x] Zoom na imagem ao passar o mouse (desktop) ou clicar para expandir (lightbox).
- [x] Suporte a múltiplas imagens por produto.

**Tarefas Técnicas:**
- Criar componente `ProductGallery`.
- Integração com Supabase Storage para URLs das imagens.

### US-06: Seleção de Variação (Tamanho)
**História:** Como cliente, quero selecionar o tamanho, para ver o preço correspondente.

**Critérios de Aceitação:**
- [x] Botões visíveis com os nomes das variações (ex: Casal, Queen).
- [x] O botão do tamanho selecionado deve ter destaque visual (borda/cor diferente).
- [x] Ao mudar o tamanho, o **Preço** e o **Preço "De"** devem atualizar imediatamente.
- [x] Se uma variação estiver sem estoque (opcional para V1), o botão deve estar desabilitado ou visualmente indicativo.

**Tarefas Técnicas:**
- Lógica de estado no React (`useState` para `selectedVariant`).
- Buscar todas as variantes do produto (`SELECT * FROM variants WHERE product_id = ...`).

### US-07: Informações Técnicas
**História:** Como cliente, quero ler especificações técnicas, para confirmar detalhes.

**Critérios de Aceitação:**
- [x] Exibir descrição rica (HTML/Markdown renderizado).
- [x] Tabela ou lista clara com dimensões do tamanho selecionado.

**Tarefas Técnicas:**
- Renderização de Rich Text.

---

## Épico 3: Checkout via WhatsApp

### US-08: Botão "Comprar pelo WhatsApp"
**História:** Como cliente, quero iniciar uma conversa com o vendedor com os detalhes já preenchidos.

**Critérios de Aceitação:**
- [x] O botão deve ser proeminente (CTA Principal) na página do produto.
- [x] Ao clicar, deve abrir o WhatsApp Web (desktop) ou App do WhatsApp (mobile).
- [x] A mensagem pré-preenchida deve conter: Nome do Produto, Tamanho Selecionado, Preço e Código (SKU).
- [x] Formatação da mensagem deve ser legível (uso de quebras de linha e emojis).

**Tarefas Técnicas:**
- Implementar função `generateWhatsAppLink`.
- Configurar número de telefone do vendedor em variável de ambiente.

### US-09: Validação de Seleção
**História:** Como cliente, quero que o sistema me avise se eu esquecer de selecionar um tamanho.

**Critérios de Aceitação:**
- [x] Se o usuário clicar em "Comprar" sem selecionar tamanho, **NÃO** abrir o WhatsApp.
- [x] Exibir mensagem de erro visual (Toast ou texto vermelho abaixo das opções).
- [x] Focar ou destacar a área de seleção de tamanho.

**Tarefas Técnicas:**
- Validação no handler `handleBuyClick`.

---

## Épico 4: Performance & SEO

### US-10: SEO e Metatags
**História:** Como vendedor, quero que meus produtos apareçam no Google.

**Critérios de Aceitação:**
- [ ] Cada página de produto deve ter `<title>` e `<meta description>` dinâmicos baseados no produto.
- [ ] Implementar Open Graph (imagem e título corretos ao compartilhar no WhatsApp/Facebook).
- [ ] Sitemap.xml gerado automaticamente.

**Tarefas Técnicas:**
- Usar `generateMetadata` do Next.js App Router.

---

## Épico 5: Dados & Conteúdo

### US-11: Coleta de Dados (Web Scraping Completo)
**História:** Como administrador, quero popular o banco de dados com **todos** os produtos ativos do site oficial, para que o catálogo esteja **completo** desde o início.

**Critérios de Aceitação:**
- [x] O script deve varrer as principais categorias (Colchões, Camas, Travesseiros).
- [x] Extrair todos os produtos ativos (Ignorar indisponíveis se possível).
- [x] Para cada produto, extrair:
    - Título e Descrição HTML.
    - Todas as imagens de alta resolução.
    - Mapeamento completo de variações (Tamanho x Preço x SKU).
- [x] Gerar arquivo `seed.json` compatível com a modelagem do Supabase.

**Tarefas Técnicas:**
- Criar script com `Puppeteer` ou `Playwright`.
- Lógica de navegação recursiva (Paginação).
