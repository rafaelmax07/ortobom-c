// Detecta e corrige UTF-8 lido como Windows-1252/Latin-1 (mojibake) em arquivos
// de texto do projeto. Ex: "â€"" → "—", "Ã£" → "ã".
// Estratégia: lê o arquivo como buffer; tenta decode-as-latin1 e re-encode-as-utf8;
// se o resultado contém menos sequências mojibake do que o original, reescreve.
const fs = require('node:fs')
const path = require('node:path')

const ROOTS = ['src', 'docs']

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build'])
const ALLOWED_EXT = new Set([
    '.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.sql', '.css', '.html',
])

// Sequências características de UTF-8 lido como Latin-1 / cp1252
const MOJIBAKE_PATTERNS = [
    'Ã£', 'Ã¡', 'Ã³', 'Ã§', 'Ãµ', 'Ã©', 'Ãª', 'Ã­', 'Ãº', 'Ã¢', 'Ã´', 'Ã±',
    'Ã‰', 'Ã“', 'Ã‡', 'Ãš', 'Ã€', 'Ã“',
    'â€“', 'â€”', 'â€˜', 'â€™', 'â€œ', 'â€', 'â€¢', 'â€¦',
    'Â ', 'Â°', 'Â®', 'Â©',
    'ðŸ', // emojis
]

function countMojibake(text) {
    let count = 0
    for (const pat of MOJIBAKE_PATTERNS) {
        const idx = text.indexOf(pat)
        if (idx !== -1) {
            // count occurrences
            let i = idx
            while (i !== -1) {
                count++
                i = text.indexOf(pat, i + pat.length)
            }
        }
    }
    return count
}

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.has(entry.name)) continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full, out)
        else if (ALLOWED_EXT.has(path.extname(entry.name).toLowerCase())) out.push(full)
    }
    return out
}

let totalFixed = 0
const files = []
for (const root of ROOTS) {
    if (!fs.existsSync(root)) continue
    walk(root, files)
}

for (const file of files) {
    // O arquivo está supostamente em UTF-8 mas pode conter mojibake (UTF-8 que
    // foi gravado já como Latin-1 → quando lido como UTF-8 vira "Ã£" etc).
    // Solução: ler como UTF-8, contar mojibake; se houver, converter as
    // bytes UTF-8 atuais como se fossem Latin-1 para "desfazer" a duplicação.
    const original = fs.readFileSync(file, 'utf8')
    const before = countMojibake(original)
    if (before === 0) continue

    // Converte: pega a string atual, reinterpreta cada caractere como byte
    // Latin-1, e decodifica como UTF-8.
    const buf = Buffer.from(original, 'latin1')
    const fixed = buf.toString('utf8')
    const after = countMojibake(fixed)

    if (after < before) {
        fs.writeFileSync(file, fixed, 'utf8')
        console.log(`fixed: ${file} (${before} → ${after} mojibake sequences)`)
        totalFixed++
    } else {
        console.log(`skipped: ${file} (could not improve, ${before} sequences)`)
    }
}

console.log(`\nDone. ${totalFixed} files fixed.`)
