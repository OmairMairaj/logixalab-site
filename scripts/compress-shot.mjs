import sharp from "sharp";
import { statSync } from "node:fs";

const src = "public/images/work/shopbreeze.png";
const out = "public/images/work/shopbreeze.webp";

const before = statSync(src).size;
const info = await sharp(src)
  .resize({ width: 1440, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile(out);
const after = statSync(out).size;

console.log(
  `${out}  ${info.width}x${info.height}  ` +
    `${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB ` +
    `(${(100 - (after / before) * 100).toFixed(1)}% smaller)`,
);
