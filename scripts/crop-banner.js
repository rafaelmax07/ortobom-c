// Recorta os banners 4 e 5 num quadrado centralizado para uso nos cards mobile
// onde aparecem dentro de um círculo. O recorte preserva o assunto central
// (base / cabeceira) sem o zoom/crop agressivo do object-cover de uma imagem
// retangular dentro de um wrapper 1:1.
const sharp = require('sharp')
const path = require('path')

async function processOne(file) {
    const inp = path.join('public', 'banners', `${file}.webp`)
    const out = path.join('public', 'banners', `${file}-square.webp`)
    const meta = await sharp(inp).metadata()
    const w = meta.width
    const h = meta.height
    const size = Math.min(w, h)
    const left = Math.round((w - size) / 2)
    const top = Math.round((h - size) / 2)
    console.log(`${file}: ${w}x${h} -> crop ${size}x${size} from (${left},${top})`)
    await sharp(inp)
        .extract({ left, top, width: size, height: size })
        .resize(900, 900)
        .webp({ quality: 88 })
        .toFile(out)
    console.log('  saved to', out)
}

;(async () => {
    await processOne('round-banner-4')
    await processOne('round-banner-5')
})().catch(err => {
    console.error(err)
    process.exit(1)
})
