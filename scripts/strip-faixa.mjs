// Remove a moldura branca e a faixa vinho (legenda + logo) de fotos exportadas
// do PowerPoint, deixando só a foto. A legenda passa a ser texto HTML
// (<figcaption>) na página, então trocar foto ou texto não exige refazer imagem.
//
// Uso:
//   node scripts/strip-faixa.mjs <arquivo|pasta> [...]           sobrescreve no lugar
//   node scripts/strip-faixa.mjs <arquivo|pasta> [...] --out dir  grava em outra pasta
//   node scripts/strip-faixa.mjs <arquivo> --box x,y,w,h          caixa de corte manual, em px
//                                                                 (para slides com outro layout)
//
// Geometria de referência (slide 1792×1280): foto em x 15–1778 e y 15–1150,
// faixa em y 1168–1262. O corte deixa 3 px de folga dentro da foto. Para
// slides de outro tamanho a caixa é proporcional.
import sharp from 'sharp';
import { readdirSync, statSync, readFileSync, mkdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const REF = { w: 1792, h: 1280 };
const BOX = { x: 18, y: 18, w: 1756, h: 1128 };
const EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outDir = outIdx >= 0 ? args.splice(outIdx, 2)[1] : null;
const boxIdx = args.indexOf('--box');
const manual = boxIdx >= 0 ? args.splice(boxIdx, 2)[1].split(',').map(Number) : null;
if (!args.length) {
  console.error('Uso: node scripts/strip-faixa.mjs <arquivo|pasta> [...] [--out pasta]');
  process.exit(1);
}
if (outDir) mkdirSync(outDir, { recursive: true });

const files = args.flatMap((p) =>
  statSync(p).isDirectory()
    ? readdirSync(p).filter((f) => EXTS.has(extname(f).toLowerCase())).map((f) => join(p, f))
    : [p],
);

for (const file of files) {
  // lê para a memória: no Windows o sharp mantém o arquivo aberto e impede sobrescrevê-lo
  const input = readFileSync(file);
  const { width, height } = await sharp(input).metadata();
  const sx = width / REF.w;
  const sy = height / REF.h;
  const region = manual ? { left: manual[0], top: manual[1], width: manual[2], height: manual[3] } : {
    left: Math.round(BOX.x * sx),
    top: Math.round(BOX.y * sy),
    width: Math.round(BOX.w * sx),
    height: Math.round(BOX.h * sy),
  };
  const ext = extname(file).toLowerCase();
  let img = sharp(input).extract(region);
  if (ext === '.webp') img = img.webp({ quality: 90 });
  else if (ext === '.jpg' || ext === '.jpeg') img = img.jpeg({ quality: 90 });

  await img.toFile(outDir ? join(outDir, basename(file)) : file);
  console.log(`${file}: ${width}x${height} -> ${region.width}x${region.height}`);
}
