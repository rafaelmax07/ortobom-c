import { render } from "@testing-library/react";
import { Container } from "./Container";

/**
 * Property 4: Container max-width follows the breakpoint step function.
 *
 * Validates: Requirements 1.6, 6.3
 *
 * Strategy: jsdom does not evaluate CSS media queries reliably, so we cannot
 * observe the resolved `max-width` of the rendered element. Instead we assert
 * that the rendered `<Container>` exposes the exact responsive Tailwind
 * arbitrary-value classes that wire each breakpoint to its blueprint
 * max-width.
 *
 * Tailwind v4 derives the `sm:` / `md:` / `lg:` / `xl:` prefixes from the
 * `--breakpoint-*` tokens declared in `src/app/globals.css` (asserted by the
 * sibling property test in `src/app/globals.test.ts`, Property 5). Therefore
 * the presence of these classes is sufficient to prove the step function:
 *
 *   ≥ 1200px → max-w-[1320px]   (xl, 1200px from globals.css)
 *   ≥  992px → max-w-[1140px]   (lg,  992px from globals.css)
 *   ≥  768px → max-w-[ 960px]   (md,  768px from globals.css)
 *   ≥  576px → max-w-[ 720px]   (sm,  576px from globals.css)
 *   <  576px → unbounded (only `w-full` + `mx-auto` + `px-4` apply)
 */
describe("Container max-width step function", () => {
  it("Property 4: Container max-width follows the breakpoint step function — Validates: Requirements 1.6, 6.3", () => {
    const { container } = render(
      <Container>
        <div data-testid="child">x</div>
      </Container>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.tagName).toBe("DIV");

    const className = wrapper.className;

    // Base styles → unbounded width below the sm breakpoint, centered, with
    // horizontal gutter padding.
    expect(className).toContain("w-full");
    expect(className).toContain("mx-auto");
    expect(className).toContain("px-4");

    // Step function wiring: each responsive prefix must map to the exact
    // blueprint max-width arbitrary value.
    expect(className).toContain("sm:max-w-[720px]");
    expect(className).toContain("md:max-w-[960px]");
    expect(className).toContain("lg:max-w-[1140px]");
    expect(className).toContain("xl:max-w-[1320px]");

    // Nothing else should constrain the max-width below `sm` — i.e. there must
    // be no unprefixed `max-w-*` class on the wrapper.
    const tokens = className.split(/\s+/).filter(Boolean);
    const unprefixedMaxW = tokens.filter((t) => /^max-w-/.test(t));
    expect(unprefixedMaxW).toEqual([]);
  });
});
