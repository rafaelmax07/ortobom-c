# Primitives — Design System

Camada atômica do design system. Todo componente "rico" do app deve consumir estes blocos em vez de reimplementar do zero.

> **Princípio:** se você está prestes a copiar um botão, badge ou preço de outro componente, pare e use a primitive.

---

## Tokens (em `globals.css`)

### Cores
```
--color-primary           #263e66    Azul principal (header)
--color-primary-hover     #1f3354    Hover do azul
--color-navy-dark         #121a2b    Footer, surfaces escuras
--color-navy-medium       #263e66    Alias do primary
--color-navy-nav          #243a5e    Barra de navegação
--color-accent            #fb8c00    Laranja (OFERTAS, badges discount)
--color-accent-hover      #e67c00    Hover laranja
--color-bg-page           #ffffff    Fundo de página
--color-bg-light          #f4f6fb    Fundo cinza-azulado de seções
--color-bg-soft           #f8f9fa    Fundo cinza neutro
--color-text-main         #212529    Texto principal
--color-text-soft         #424242    Texto secundário
--color-text-muted        #757575    Texto terciário/meta
--color-border            #e4e4e7    Borda padrão
--color-success           #1b5e20    Verde escuro
--color-success-bg        #e8f5e9    Verde claro
--color-danger            #d32f2f    Vermelho
--color-whatsapp          #25d366    WhatsApp brand
--color-whatsapp-hover    #1da851    Hover WhatsApp
```

### Tipografia
- **Tamanhos:** `--text-xs` (11px) → `--text-6xl` (32px)
- **Pesos:** `regular` (400), `medium` (500), `semibold` (600), `bold` (700), `extrabold` (800)
- **Line heights:** `tight` (1.2), `snug` (1.35), `normal` (1.5), `relaxed` (1.65)

### Outros
- **Spacing:** `--space-1` (4px) → `--space-16` (64px)
- **Radius:** `--radius-button` (4px), `--radius-card` (8px)
- **Shadows:** `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-mega`
- **Container:** `--container-max` (1320px) — usado em `max-w-[1280px]` na home

---

## Classes tipográficas (uso direto)

```html
<h1 className="t-page-heading">Página</h1>
<h2 className="t-section-heading">Seção</h2>
<h3 className="t-subsection-heading">Subseção</h3>
<h3 className="t-product-title">Nome do produto</h3>
<p className="t-product-meta">Casal (31x188x138)</p>
<p className="t-price-large">R$ 1.999,00</p>
<p className="t-price-medium">R$ 1.999,00</p>
<span className="t-price-strike">R$ 2.500,00</span>
<span className="t-price-suffix">à vista</span>
<p className="t-body">Texto longo, parágrafo padrão.</p>
<p className="t-body-small">Texto auxiliar.</p>
<span className="t-meta">Texto pequeno, metadata.</span>
<span className="t-eyebrow">CATEGORIA</span>
<span className="t-badge">10% OFF</span>
<span className="t-nav-link">Colchões</span>
<span className="t-button">COMPRAR</span>
<span className="t-button-small">VER DETALHES</span>
<a className="t-link">Ver todas</a>
<h4 className="t-footer-heading">INSTITUCIONAL</h4>
<a className="t-footer-link">Sobre</a>
```

Mude no `globals.css` → reflete em todo o site.

---

## Componentes

### `<Button>` / `<LinkButton>`

```tsx
import { Button, LinkButton } from '@/components/ui/primitives'

// Botão padrão
<Button variant="primary" size="md">Salvar</Button>
<Button variant="secondary" size="sm">Cancelar</Button>
<Button variant="whatsapp" size="lg" leadingIcon={<MessageCircle />}>
  Falar no WhatsApp
</Button>
<Button variant="ghost" disabled>Inativo</Button>
<Button variant="outline-light">Sobre fundo escuro</Button>

// Como link (semântica <a> ou next/Link automático)
<LinkButton href="/p/colchao-orion" variant="primary" size="sm" fullWidth>
  Ver Detalhes
</LinkButton>
<LinkButton href="https://wa.me/..." variant="whatsapp">
  Externo (vira <a>)
</LinkButton>
```

**Variants:** `primary` · `secondary` · `whatsapp` · `ghost` · `outline-light`
**Sizes:** `sm` · `md` · `lg`
**Props extras:** `leadingIcon`, `trailingIcon`, `fullWidth`, `disabled`, `className`

---

### `<Badge>`

```tsx
<Badge variant="discount">20% OFF</Badge>
<Badge variant="coupon" size="sm">+10% OFF · Use SUPER10</Badge>
<Badge variant="success" leadingIcon={<Check size={12} />}>Economize R$ 300</Badge>
<Badge variant="count">3 Tamanhos Disponíveis</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="danger" shape="square">Esgotado</Badge>
<Badge variant="neutral">Tag</Badge>
```

**Variants:** `discount` (laranja) · `coupon` (cinza claro) · `success` (verde) · `count` · `info` · `danger` · `neutral`
**Sizes:** `sm` · `md` ; **Shapes:** `pill` · `square`

---

### `<IconButton>`

Botão circular ou quadrado com apenas ícone — para setas de carrossel, arrows do banner, etc.

```tsx
<IconButton variant="default" rounded="md" aria-label="Anterior">
  <ChevronLeft size={18} />
</IconButton>

<IconButton variant="navy" size="lg" rounded="full">
  <ChevronRight size={20} />
</IconButton>

<IconButton variant="overlay" size="sm" rounded="full">
  <ChevronLeft size={16} />
</IconButton>

<IconButton variant="dark-overlay">
  <ChevronLeft size={16} />
</IconButton>
```

**Variants:** `default` · `overlay` (sobre imagem) · `dark-overlay` · `navy` · `ghost`
**Sizes:** `sm` (32) · `md` (36) · `lg` (40)

---

### `<PriceDisplay>`

```tsx
<PriceDisplay
  price={1999}
  compareAtPrice={2500}
  priceLabel="A partir de"
  variant="card"
  showInstallments
/>

<PriceDisplay price={3499} variant="pdp" showSavings showInstallments />

<PriceDisplay price={1999} variant="cart-line" />

<PriceDisplay price={1999} variant="mini" />
```

**Variants:**
- `card` (default): preço médio, sufixo "à vista", parcelamento on/off
- `pdp`: preço grande extra-bold pra página de produto
- `cart-line`: compacto, sem parcelamento
- `mini`: só preço atual

---

### `<Typography>`

Wrapper opcional. Equivale a `<tag className="t-{variant}">`.

```tsx
<Typography variant="section-heading">Ofertas</Typography>
<Typography variant="product-title" as="h2">Colchão Orion</Typography>
<Typography variant="meta">Casal (138x188)</Typography>
```

---

## Compositions (camada acima)

- `<ProductCard product={...} variant="grid|offer|mini" />` — Card de produto unificado. Variant `offer` ativa galeria com hover, badges duplos.
- `<ProductGrid products={...} columns={4} cardVariant="grid" />` — Grade de cards padronizada.
- `<Section title="..." seeMoreHref="..." background="white|light|soft|navy-dark" divider="top|bottom|both">` — Template de seção com header + link "Ver todas".

Exemplo:
```tsx
<Section
  title="Já conhece nossas bases?"
  seeMoreHref="/c/camas"
  seeMoreLabel="Ver todas as bases"
  divider="top"
>
  <ProductGrid products={bases} />
</Section>
```

---

## Quando NÃO usar primitives

Se o estilo for **único** e claramente não vai aparecer em outro lugar, classes utilitárias direto no JSX são OK. Use primitives para qualquer padrão que apareça mais de uma vez.
