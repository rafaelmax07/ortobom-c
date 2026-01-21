# Sobre o Projeto: E-commerce Vitrine (Clone Ortobom)

## Visão Geral
Este projeto é uma plataforma de catálogo virtual de alta performance inspirada na identidade visual de grandes varejistas, tendo como **referência absoluta de design o site oficial da Ortobom (https://www.ortobom.com.br/)**. O diferencial principal é o modelo de **Fechamento de Venda via WhatsApp**, eliminando a necessidade de gateways de pagamento complexos e taxas de transação in-app.

O objetivo é fornecer uma experiência de usuário (UX) tão fluida quanto um e-commerce tradicional, mas simplificando a logística e o financeiro para o vendedor.

## Arquitetura e Tech Stack

A arquitetura foi escolhida focando em **Custo Zero (Free Tier)**, **SEO** e **Performance**.

### Frontend
- **Framework:** Next.js 14+ (App Router) - Para SSR e otimização de SEO.
- **Estilização:** Tailwind CSS - Para desenvolvimento ágil e responsivo.
- **Ícones:** Lucide React (Padrão de mercado para React).

### Backend (Serverless)
- **Plataforma:** Supabase.
- **Banco de Dados:** PostgreSQL.
- **Armazenamento:** Supabase Storage (Imagens).
- **Autenticação:** Supabase Auth (Painel Admin).

### Infraestrutura
- **Hospedagem:** Vercel.
- **Domínio:** Custo único de registro.

## Modelagem de Dados Resumida

O sistema lida com a complexidade de variações de produtos (ex: Tamanhos de colchão).

1.  **categories**: Agrupamento de produtos (Colchões, Camas).
2.  **products**: A entidade principal (Nome, Descrição, Imagem de destaque).
3.  **variants**: O item vendável específico (SKU, Tamanho, Preço, Preço promocional, Dimensões).

### Estratégia de Dados (Scraping)
Para garantir fidelidade total, o banco de dados será populado via **Web Scraping** do site oficial. Isso garante que imagens de alta resolução, descrições técnicas e variações de preço/tamanho sejam idênticas às do fabricante.

---
*Este documento serve como referência técnica e de negócio para novos desenvolvedores.*
