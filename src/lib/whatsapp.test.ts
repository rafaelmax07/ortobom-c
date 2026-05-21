import { describe, it } from "vitest";
import fc from "fast-check";
import {
  WHATSAPP_MESSAGE_TEMPLATE,
  buildWhatsAppDeeplink,
  formatBRL,
} from "./whatsapp";

describe("buildWhatsAppDeeplink", () => {
  it("Property 8 (partial): Deeplink round-trips the templated message — Validates: Requirements 4.5, 4.6, 4.7", () => {
    const variantArb = fc.record({
      size: fc.string({ minLength: 1, maxLength: 30 }),
      price: fc.float({
        min: Math.fround(1),
        max: Math.fround(99999),
        noNaN: true,
        noDefaultInfinity: true,
      }),
      sku: fc.string({ minLength: 1, maxLength: 30 }),
      dimensions: fc.option(fc.string({ maxLength: 30 }), { nil: null }),
    });

    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        variantArb,
        fc.stringMatching(/^[0-9]{10,15}$/),
        (productName, variant, phone) => {
          const url = buildWhatsAppDeeplink({ phone, productName, variant });

          const digits = phone.replace(/\D/g, "");
          const prefix = `https://wa.me/${digits}?text=`;

          // (a) URL starts with `https://wa.me/{digits}?text=`
          if (!url.startsWith(prefix)) {
            throw new Error(
              `URL does not start with expected prefix.\nExpected prefix: ${prefix}\nActual URL: ${url}`,
            );
          }

          // (b) digits === phone.replace(/\D/g, "")
          // The digits embedded in the URL must equal the stripped phone.
          const urlDigits = url.slice("https://wa.me/".length, url.indexOf("?"));
          if (urlDigits !== digits) {
            throw new Error(
              `URL digits ${urlDigits} do not equal phone.replace(/\\D/g, "") ${digits}`,
            );
          }

          // (c) decodeURIComponent(text) equals the manually-rendered template.
          const encodedText = url.slice(prefix.length);
          const decoded = decodeURIComponent(encodedText);

          const expected = WHATSAPP_MESSAGE_TEMPLATE
            .replace("{productName}", productName)
            .replace("{size}", variant.size)
            .replace("{dimensions}", variant.dimensions ?? "")
            .replace("{formattedPrice}", formatBRL(variant.price))
            .replace("{sku}", variant.sku);

          if (decoded !== expected) {
            throw new Error(
              `Decoded message does not match expected template render.\nExpected: ${JSON.stringify(expected)}\nActual:   ${JSON.stringify(decoded)}`,
            );
          }
        },
      ),
    );
  });
});
