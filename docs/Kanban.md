# Quadro Kanban

## 📝 To Do (A Fazer)

### Fase 1: Setup e Dados (Fundação)
- [ ] Popular banco com dado real (Seed)

### Fase 2: Interface & Navegação (Épicos 1 & 2)
- [ ] **US-01**: Slider de Promoções na Home
  - *Tech*: Componente `HeroSlider`, Tabela de banners
- [ ] **US-02**: Categorias em Destaque
  - *Tech*: Componente `CategoryGrid`
- [ ] **US-03**: Busca de Produtos
  - *Tech*: Componente `SearchBar`, Query `ilike`
- [ ] **US-04**: Filtros de Produto (PLP)
  - *Tech*: Sidebar/Drawer, Query dinâmica
- [ ] **US-05**: Galeria de Imagens (PDP)
  - *Tech*: Componente `ProductGallery`
- [ ] **US-06**: Seleção de Variação (Tamanho)
  - *Tech*: Estado `selectedVariant`, Query variants
- [ ] **US-07**: Informações Técnicas
  - *Tech*: Renderização Rich Text

### Fase 3: Lógica de Venda & Checkout (Épico 3)
- [ ] **US-08**: Botão "Comprar pelo WhatsApp"
  - *Tech*: Função `generateWhatsAppLink`
- [ ] **US-09**: Validação de Seleção
  - *Tech*: Handler `handleBuyClick`

### Fase 4: Otimização & SEO (Épico 4)
- [ ] **US-10**: SEO e Metatags
  - *Tech*: `generateMetadata`, Sitemap
- [ ] Deploy na Vercel

---

## 🚧 In Progress (Em Progresso)
- [ ] **US-11**: Coleta de Dados (Web Scraping Completo)
  - *Tech*: Script Node.js (`Puppeteer`), Scan recursivo

---

## ✅ Done (Concluído)
- [x] Definição do escopo e requisitos (README.md)
- [x] Criação da documentação (User Stories, About, Kanban, Tasks)
- [x] Configurar projeto Next.js + Tailwind
- [x] Configurar projeto Supabase
- [x] Criar tabelas no Supabase (categories, products, variants)
