export interface WhatsAppDeeplinkArgs {
  phone: string; // digits only, e.g. "558399283994"
  productName: string;
  variant: {
    size: string;
    price: number;
    sku: string;
    dimensions?: string | null;
  };
}

export const WHATSAPP_MESSAGE_TEMPLATE =
  "Olá! Gostaria de saber sobre o prazo e o frete para este item:\n\n" +
  "*Modelo:* {productName}\n" +
  "*Tamanho:* {size} ({dimensions})\n" +
  "*Preço:* {formattedPrice}\n" +
  "*SKU:* {sku}\n\n" +
  "Por favor, me informe as opções para pagamento.";

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
    .format(value)
    .replace(/\u00A0/g, " ");
}

export function buildWhatsAppMessage(
  args: Omit<WhatsAppDeeplinkArgs, "phone">,
): string {
  const { productName, variant } = args;
  return WHATSAPP_MESSAGE_TEMPLATE.replace("{productName}", productName)
    .replace("{size}", variant.size)
    .replace("{dimensions}", variant.dimensions ?? "")
    .replace("{formattedPrice}", formatBRL(variant.price))
    .replace("{sku}", variant.sku);
}

export function buildWhatsAppDeeplink(args: WhatsAppDeeplinkArgs): string {
  const message = buildWhatsAppMessage(args);
  const phoneDigits = args.phone.replace(/\D/g, "");
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}

export function resolveWhatsAppPhone(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
  return raw.trim().replace(/\D/g, "");
}
