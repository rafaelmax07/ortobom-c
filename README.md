# Projeto: E-commerce Vitrine (Clone Ortobom) com Checkout via WhatsApp

## 1. Visão Geral
**Objetivo:** Desenvolver uma plataforma de catálogo virtual de alta performance, replicando a identidade visual e experiência de usuário de grandes varejistas (**Referência Visual Exata:** [Ortobom.com.br](https://www.ortobom.com.br/)), mas substituindo o gateway de pagamento tradicional por uma finalização de compra direta via WhatsApp.

**Modelo de Negócio:** O site atua como vitrine. O fechamento da venda, negociação de frete e pagamento ocorrem no ambiente do WhatsApp entre Vendedor e Cliente.

---

## 2. Tech Stack (Arquitetura Sugerida)
Foco em custo zero de infraestrutura (Free Tiers), alta performance (SEO) e agilidade de desenvolvimento.

### Frontend
- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router).
  - *Motivo:* SSR (Server Side Rendering) é obrigatório para SEO de e-commerce.
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/).
  - *Motivo:* Rapidez para clonar interfaces complexas e responsividade nativa.
- **Ícones:** Lucide React.

### Backend & Dados (Serverless)
- **BaaS (Backend as a Service):** [Supabase](https://supabase.com/).
  - **Database:** PostgreSQL.
  - **Auth:** Supabase Auth (para o painel administrativo).
  - **Storage:** Supabase Storage (para hospedar as imagens dos produtos).
  - *Motivo:* O "Table Editor" do Supabase serve como um painel administrativo básico para o cliente no início, poupando tempo de desenvolvimento de dashboard.

### Infraestrutura
- **Hospedagem Frontend:** Vercel.
- **Domínio:** Apenas custo do registro (`.com.br`).

---

## 3. Modelagem de Dados (Schema)

Como colchões possuem variações críticas (Tamanho), a modelagem deve separar o **Produto** da **Variação**.

### Tabela: `categories`
- `id` (uuid)
- `name` (text) - Ex: Colchões, Camas, Travesseiros
- `slug` (text)

### Tabela: `products` (O modelo geral)
- `id` (uuid)
- `name` (text) - Ex: "Colchão Freedom"
- `slug` (text) - Ex: "colchao-freedom"
- `description` (text/rich text)
- `category_id` (FK)
- `featured_image` (url)
- `is_active` (boolean)

### Tabela: `variants` (O item vendável)
- `id` (uuid)
- `product_id` (FK)
- `sku` (text) - Ex: "FREE-CASAL"
- `size` (text) - Ex: "Casal", "Queen", "King"
- `price` (numeric) - Preço atual
- `compare_at_price` (numeric) - Preço "De" (para mostrar desconto)
- `dimensions` (text) - Ex: "138x188x32"

---

## 4. Funcionalidades Core

### A. Home Page (Vitrine)
- **Hero Slider:** Banners rotativos full-width (Promoções).
- **Categorias em Destaque:** Grid visual.
- **Vitrine de Produtos:** Cards com foto, nome, "A partir de R$ X" e selo de desconto.

### B. Página de Produto (PDP)
- **Galeria de Imagens:** Principal + Thumbnails.
- **Seletor de Variação:** Botões para escolher o tamanho (Solteiro, Casal, etc). Ao clicar, o preço deve atualizar instantaneamente.
- **Descrição Técnica:** Abas ou Accordion (Características, Dimensões, Garantia).
- **Botão CTA:** "COMPRAR PELO WHATSAPP" (Fixo no rodapé em mobile).

### C. Filtros e Busca (PLP)
- Filtros laterais por: Categoria, Faixa de Preço e Tamanho.
- Barra de busca global.

---

## 5. Implementação do Checkout WhatsApp

A lógica deve capturar a variação selecionada e montar uma URL codificada.

### Utilitário (TypeScript)
```typescript
/**
 * Gera o link do WhatsApp com a mensagem formatada
 */
export const generateWhatsAppLink = (
  phone: string,
  productName: string,
  variant: { size: string; price: number; sku: string }
) => {
  const message = `Olá! Tenho interesse neste produto:
  
🛏️ *Modelo:* ${productName}
📏 *Tamanho:* ${variant.size}
💰 *Preço:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(variant.price)}
🆔 *Cód:* ${variant.sku}

Gostaria de saber sobre frete e prazo de entrega.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
```

### Comportamento do Botão
1. Validar se o usuário selecionou um tamanho.
2. Se não, exibir *toast* de erro: "Por favor, selecione um tamanho".
3. Se sim, abrir `window.open(url, '_blank')`.
4. **Analytics:** Disparar evento de conversão (Pixel/GA4) no clique do botão.

---

## 6. Diferenciais Técnicos (Vantagens sobre WordPress)

1.  **Imagens Otimizadas:** Uso do componente `<Image />` do Next.js para converter automaticamente para WebP/AVIF, garantindo carregamento rápido mesmo com fotos pesadas de colchões.
2.  **SEO Programático:** Geração automática de `sitemap.xml` e meta tags dinâmicas para cada produto.
3.  **Zero Loading:** Uso de React Server Components para renderizar o produto instantaneamente, sem spinners infinitos.

---

## 7. Roteiro de Desenvolvimento

### Fase 1: Setup e Dados
- [ ] Configurar projeto Next.js + Tailwind.
- [ ] Configurar projeto Supabase.
- [ ] Criar tabelas no Supabase.
- [ ] **Scraping Completo:** Desenvolver script para extrair todo o catálogo (Imagens, Descrições, Preços) do site oficial.

### Fase 2: Interface (UI)
- [ ] Criar Componente `ProductCard`.
- [ ] Criar Layout (Header com Mega Menu, Footer).
- [ ] Desenvolver a Página de Produto (Lógica de seleção de variante).

### Fase 3: Lógica de Venda
- [ ] Implementar função geradora de link WhatsApp.
- [ ] Criar barra de busca e filtros.

### Fase 4: Otimização
- [ ] Configurar Metadata (Open Graph para links bonitos no Zap).
- [ ] Deploy na Vercel.

---

## 8. Considerações Futuras (Upsell)
- **Carrinho de Orçamento:** Permitir adicionar vários itens (ex: Colchão + 2 Travesseiros) e enviar o pedido completo em uma única mensagem no WhatsApp.
- **Painel Customizado:** Se o cliente achar o Supabase confuso, criar uma rota `/admin` simples no Next.js apenas para edição de preços.
