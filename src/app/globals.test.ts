import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Property 5: Tailwind responsive prefixes activate at the declared breakpoints.
 *
 * Validates: Requirements 1.5, 6.1, 6.2
 *
 * Strategy: read `src/app/globals.css` as a string, extract the `@theme inline { ... }`
 * block, and assert that each of the five required breakpoint declarations is
 * present inside that block exactly. Because Tailwind v4 derives its responsive
 * prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) from `--breakpoint-*` tokens
 * declared inside `@theme`, asserting these declarations is equivalent to
 * asserting the prefixes activate at the declared pixel values.
 */
describe("globals.css @theme inline breakpoint tokens", () => {
  const cssPath = join(process.cwd(), "src", "app", "globals.css");
  const css = readFileSync(cssPath, "utf8");

  // Extract the body of the first `@theme inline { ... }` block. We use a
  // non-greedy match against the first closing `}` since the block does not
  // contain nested braces.
  const themeMatch = css.match(/@theme\s+inline\s*\{([\s\S]*?)\}/);

  it("contains an `@theme inline { ... }` block", () => {
    expect(themeMatch).not.toBeNull();
  });

  const themeBody = themeMatch ? themeMatch[1] : "";

  const expectedDeclarations: ReadonlyArray<string> = [
    "--breakpoint-sm: 576px",
    "--breakpoint-md: 768px",
    "--breakpoint-lg: 992px",
    "--breakpoint-xl: 1200px",
    "--breakpoint-2xl: 1400px",
  ];

  for (const declaration of expectedDeclarations) {
    it(`declares \`${declaration}\` inside the @theme inline block`, () => {
      expect(themeBody).toContain(declaration);
    });
  }
});
