# Prompt para Agente — Extração de Variantes Ortobom

Cole o conteúdo abaixo no agente. Anexe o arquivo `docs/produtos-para-extrair-variantes.json` quando o agente puder receber arquivos. Se não, cole o JSON no fim do prompt.

---

## ROLE

Você é um agente de extração de dados de e-commerce. Sua tarefa é navegar no site oficial da Ortobom e extrair todas as variantes (tamanhos) disponíveis de cada produto da lista que vou fornecer.

## CONTEXTO

A Ortobom é uma fabricante brasileira de colchões. No site oficial (https://www.ortobom.com.br), cada **tamanho** de um produto é uma página separada com URL própria. Por exemplo, o "Colchão Liberty" tem páginas distintas para Solteiro, Casal, Queen, King, etc., cada uma com seu próprio preço e link.

Estou populando um banco de dados local e preciso, para cada produto, da lista completa de tamanhos disponíveis com seus respectivos preços e dimensões.

## INPUT

Vou te passar uma lista JSON de produtos no formato:

```json
[
  {
    "name": "Colchão Liberty",
    "slug": "colchao-liberty",
    "category": "colchoes",
    "url": "https://www.ortobom.com.br/p/colchao/colchao-liberty/casal138"
  }
]
```

A `url` é apenas uma das variantes do produto (geralmente a "Casal"). Você precisa descobrir as outras.

## TAREFA

Para cada produto:

1. **Acesse** a URL fornecida.
2. **Localize** a seção "Selecionar tamanho" na página. Cada bloco visível com um tamanho (ex: "Solteiro", "Casal", "Queen", "King", "Solteiro Extra", etc.) é uma variante.
3. **Extraia** para cada variante:
   - `size`: nome do tamanho (ex: "Solteiro", "Casal", "Queen", "King", "Super King", "Solteiro Extra", "Infantil", etc.)
   - `dimensions`: dimensões em cm no formato `"AAxBBxCC"` ou `"AA x BB x CC"` (ex: `"25 x 188 x 138"`)
   - `price`: preço numérico em reais (sem `R$`, sem ponto de milhar, ponto decimal). Exemplo: `1499.00`. Use o preço **à vista** mostrado na página.
4. **Ignore** a opção "Sob medida" — não é uma variante padrão.
5. **Se o produto não tem seletor de tamanho** (ex: travesseiros, acessórios, alguns móveis): retorne apenas uma variante com `size: "Padrão"`, dimensões vazias e o preço da página.
6. **Se algum tamanho mostrar "Consultar" ou estiver indisponível**: ignore-o, não inclua na lista.
7. Também extraia o `compare_at_price` (preço "de", riscado) se existir, da variante atualmente selecionada na página.

## DICAS DE EXTRAÇÃO (HTML real do site)

A estrutura típica de cada card de tamanho na PDP é:

```html
<div class="sizeOpts" data-link="/p/colchao/colchao-liberty/solteiro88">
  <p class="fw-semibold text-blue700">Solteiro</p>
  <small class="fw-medium">25 x 188 x 88 cm</small>
  <div class="s-fs-2 fw-semibold text-blue700">R$ 1.019,00</div>
</div>
```

A variante atualmente selecionada tem a classe extra `active` e o preço aparece em outro lugar da página (`#precoAVistaProduto` ou `.newPrice`). O preço "de" (compare_at_price) está em `#precoSugeridoProduto` ou `.oldPrice`.

Algumas páginas só carregam o seletor de tamanhos depois que o JavaScript executa um AJAX. Espere o conteúdo carregar antes de extrair (ou role a página um pouco para forçar lazy-load).

## FORMATO DE SAÍDA OBRIGATÓRIO

Retorne **um único JSON** no formato exato abaixo, sem nenhum texto antes ou depois:

```json
{
  "products": [
    {
      "slug": "colchao-liberty",
      "compare_at_price": 4550.00,
      "variants": [
        { "size": "Solteiro",       "dimensions": "31 x 188 x 88",  "price": 2299.00 },
        { "size": "Solteiro Extra", "dimensions": "31 x 188 x 108", "price": 2599.00 },
        { "size": "Casal",          "dimensions": "31 x 188 x 138", "price": 3099.00 },
        { "size": "Queen",          "dimensions": "31 x 198 x 158", "price": 3899.00 },
        { "size": "King",           "dimensions": "31 x 203 x 193", "price": 4399.00 }
      ]
    },
    {
      "slug": "travesseiro-pro-latex",
      "compare_at_price": null,
      "variants": [
        { "size": "Padrão", "dimensions": "", "price": 459.00 }
      ]
    }
  ]
}
```

### Regras do formato

- O campo `slug` deve ser exatamente o mesmo que veio na lista de input (não invente).
- `price` e `compare_at_price` são **números** (não strings, não tem `R$`).
- `compare_at_price` é `null` quando não há preço "de" promocional.
- `dimensions` é string vazia `""` quando o produto não tem dimensões (travesseiros, acessórios sem tamanho).
- A ordem das variantes em cada produto: do menor tamanho para o maior (Solteiro → Solteiro Extra → Casal → Queen → King → Super King).

## QUE FAZER SE FALHAR EM ALGUM PRODUTO

Se uma URL retornar 404, página em branco, ou você não conseguir extrair os dados depois de 2 tentativas:

- Inclua o produto no JSON com a chave `error` em vez de `variants`:
  ```json
  { "slug": "colchao-xyz", "error": "Página retornou 404" }
  ```
- Continue com os outros produtos. Não pare a execução.

## RESTRIÇÕES

- **Não invente** dados. Se não conseguir confirmar um preço ou dimensão, marque com `error` e siga.
- **Não traga produtos** que não estão na lista de input.
- **Não duplique** variantes (se aparecer dois "Casal" com preços diferentes, mantenha o de menor preço).
- Faça uma pausa de **1–2 segundos** entre cada requisição, para não sobrecarregar o servidor da Ortobom.

## LISTA DE PRODUTOS

Está em `docs/produtos-para-extrair-variantes.json` (anexado). Tem 53 produtos no total, divididos entre as categorias `colchoes`, `camas` (bases), `cabeceiras`, `travesseiros`, `acessorios` e `moveis`.

Quando terminar, me retorne **apenas o JSON final** no formato especificado.
