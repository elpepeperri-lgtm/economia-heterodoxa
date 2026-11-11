// Se ejecuta una vez: genera los iconos PNG de la app a partir de public/icono.svg.
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const ruta = (r) => fileURLToPath(new URL('../' + r, import.meta.url));
for (const lado of [192, 512]) {
  await sharp(ruta('public/icono.svg'), { density: 300 }).resize(lado, lado).png().toFile(ruta(`public/icono-${lado}.png`));
}
console.log('Iconos listos.');
