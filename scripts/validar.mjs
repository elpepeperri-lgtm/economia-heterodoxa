// Valida todo el contenido contra el esquema antes de compilar. Si algo falla, no compila.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { z } from 'zod';
import { Duelo, Economista, Credito } from '../src/datos/esquema.ts';

const RAIZ = new URL('..', import.meta.url);
const leer = async (ruta) => JSON.parse(await readFile(new URL(ruta, RAIZ), 'utf8'));
let errores = 0;
const pendientes = [];
const indice = [];

function revisar(nombre, esquema, dato) {
  const r = esquema.safeParse(dato);
  if (!r.success) {
    errores++;
    console.error(`\n✗ ${nombre}`);
    for (const i of r.error.issues) console.error(`   ${i.path.join('.')}: ${i.message}`);
  }
  return r.success;
}

revisar('contenido/economistas.json', z.array(Economista), await leer('contenido/economistas.json'));
revisar('contenido/creditos.json', z.record(z.string(), Credito), await leer('contenido/creditos.json'));

for (const archivo of await readdir(new URL('contenido/duelos/', RAIZ))) {
  const duelo = await leer('contenido/duelos/' + archivo);
  if (!revisar('contenido/duelos/' + archivo, Duelo, duelo)) continue;
  for (const caso of duelo.casos) {
    for (const p of caso.preguntas) {
      if (p.estado === 'verificar') pendientes.push(`- [ ] ${archivo} · ${p.id}: ${p.enunciado}`);
    }
    const ok = caso.preguntas.filter((p) => p.estado === 'ok').length;
    if (caso === duelo.casos.at(-1)) {
      const { id, titulo, pregunta, resumen, minutos, a, b, bibliografia } = duelo;
      const preguntas = duelo.casos.flatMap((c) => c.preguntas).filter((p) => p.estado === 'ok').length;
      indice.push({ id, titulo, pregunta, resumen, minutos, preguntas, a, b, bibliografia });
    }
    if (ok < 2) { errores++; console.error(`✗ ${archivo} · ${caso.id}: quedan menos de 2 preguntas verificadas`); }
  }
}

await writeFile(
  new URL('VERIFICAR.md', RAIZ),
  `# Por verificar\n\nLo que aparece aquí NO sale en el juego hasta que se confirme con una fuente.\n\n${pendientes.join('\n') || 'Nada pendiente por ahora.'}\n`,
);
await writeFile(new URL('contenido/indice.json', RAIZ), JSON.stringify(indice, null, 2) + '\n');
if (errores) { console.error(`\n${errores} error(es) de contenido.`); process.exit(1); }
console.log(`Contenido válido. Pendientes por verificar: ${pendientes.length}.`);
