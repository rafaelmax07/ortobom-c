import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Property 9: Data boundary access uses snake_case field names
 *   — Validates: Requirements 1.8, 3.1, 3.3, 5.1, 5.3
 *
 * Walks every .ts/.tsx file under src/ and asserts:
 *   (a) Zero non-comment occurrences of the camelCase aliases
 *       `.compareAtPrice`, `.featuredImage`, `.categorySlug` (and their
 *       bracket-access equivalents) at data-read sites. Component prop
 *       names like `<PriceDisplay compareAtPrice={...}>` are intentional
 *       and not flagged because the regex requires `.` or `[...]` access.
 *   (b) The snake_case identifiers `compare_at_price`, `featured_image`,
 *       `category_slug` are still present somewhere in src/ (Property 9 core).
 *   (c) Zero non-comment occurrences of legacy hex literals
 *       (#003087, #001f5c, #0044b8, #1B2B4E) — covers Property 3.
 *   (d) Zero non-comment occurrences of removed CSS variable names
 *       (--bg-grey, --text-primary, --text-secondary, --shadow-card,
 *        --shadow-card-hover, --shadow-header, --space-5, --space-10,
 *        --radius-md, --radius-xl) — covers Property 3.
 */

const SELF_PATH = fileURLToPath(import.meta.url)
const SRC_DIR = join(process.cwd(), 'src')

const LEGACY_HEX = ['#003087', '#001f5c', '#0044b8', '#1B2B4E'] as const

const REMOVED_TOKENS = [
    '--bg-grey',
    '--text-primary',
    '--text-secondary',
    '--shadow-card',
    '--shadow-card-hover',
    '--shadow-header',
    '--space-5',
    '--space-10',
    '--radius-md',
    '--radius-xl',
] as const

// Property access (`.foo`) and bracket access (`['foo']` / `["foo"]`) onto
// data objects. Component prop declarations and JSX attributes do NOT match.
const CAMEL_DATA_ACCESS_PATTERNS: { name: string; regex: RegExp }[] = [
    { name: '.compareAtPrice', regex: /\.compareAtPrice\b/g },
    { name: '.featuredImage', regex: /\.featuredImage\b/g },
    { name: '.categorySlug', regex: /\.categorySlug\b/g },
    { name: "['compareAtPrice']", regex: /\[\s*['"]compareAtPrice['"]\s*\]/g },
    { name: "['featuredImage']", regex: /\[\s*['"]featuredImage['"]\s*\]/g },
    { name: "['categorySlug']", regex: /\[\s*['"]categorySlug['"]\s*\]/g },
]

const SNAKE_DATA_IDENTIFIERS = [
    'compare_at_price',
    'featured_image',
    'category_slug',
] as const

function walkSourceFiles(dir: string): string[] {
    const out: string[] = []
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        const stat = statSync(full)
        if (stat.isDirectory()) {
            out.push(...walkSourceFiles(full))
        } else if (
            (entry.endsWith('.ts') || entry.endsWith('.tsx')) &&
            !entry.endsWith('.d.ts')
        ) {
            out.push(full)
        }
    }
    return out
}

/**
 * Strip block comments (`/* ... *\/`) and line-leading `//` comments.
 * Inline trailing `// ...` comments are intentionally preserved — the legacy
 * tokens we look for are CSS-variable / hex / camelCase identifiers that
 * shouldn't appear after `//` in normal code.
 */
function stripComments(src: string): string {
    return src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
}

const ALL_FILES = walkSourceFiles(SRC_DIR).filter((f) => f !== SELF_PATH)

describe('Property 9 — Data boundary access uses snake_case field names', () => {
    it('walks at least one .ts/.tsx file under src/', () => {
        expect(ALL_FILES.length).toBeGreaterThan(0)
    })

    it('has zero non-comment occurrences of legacy hex literals (Property 3)', () => {
        const violations: string[] = []
        for (const file of ALL_FILES) {
            const code = stripComments(readFileSync(file, 'utf8'))
            for (const hex of LEGACY_HEX) {
                if (code.includes(hex)) {
                    violations.push(`${file}: legacy hex ${hex}`)
                }
            }
        }
        expect(violations).toEqual([])
    })

    it('has zero non-comment occurrences of removed CSS variable names (Property 3)', () => {
        const violations: string[] = []
        for (const file of ALL_FILES) {
            const code = stripComments(readFileSync(file, 'utf8'))
            for (const token of REMOVED_TOKENS) {
                if (code.includes(token)) {
                    violations.push(`${file}: removed token ${token}`)
                }
            }
        }
        expect(violations).toEqual([])
    })

    it('has zero non-comment camelCase property/bracket access at data-read sites (Property 9)', () => {
        const violations: string[] = []
        for (const file of ALL_FILES) {
            const code = stripComments(readFileSync(file, 'utf8'))
            for (const { name, regex } of CAMEL_DATA_ACCESS_PATTERNS) {
                const matches = code.match(regex)
                if (matches && matches.length > 0) {
                    violations.push(
                        `${file}: camelCase data access ${name} (${matches.length}x)`,
                    )
                }
            }
        }
        expect(violations).toEqual([])
    })

    it('preserves snake_case identifiers at data-read sites (Property 9)', () => {
        const corpus = ALL_FILES.map((f) => readFileSync(f, 'utf8')).join('\n')
        for (const ident of SNAKE_DATA_IDENTIFIERS) {
            expect(
                corpus.includes(ident),
                `expected snake_case identifier "${ident}" to be present somewhere under src/`,
            ).toBe(true)
        }
    })
})
