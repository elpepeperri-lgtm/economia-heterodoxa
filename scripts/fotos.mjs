// Se ejecuta UNA vez (npm run fotos), no en cada compilación.
// Busca la foto de cada economista en Wikidata -> Wikimedia Commons, revisa la licencia,
// descarga, recorta a cuadrado y genera WebP de 160 y 480 px. Guarda créditos e informe.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const UA = 'EconomiaHeterodoxaJuego/0.1 (juego educativo sin animo de lucro; script de fotos de un solo uso)';
const RAIZ = new URL('..', import.meta.url);
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const limpio = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function api(base, params) {
  const url = base + '?' + new URLSearchParams({ format: 'json', origin: '*', ...params });
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${base}`);
  await pausa(400); // respeta los límites de la API
  return r.json();
}

function licenciaAceptada(corta = '') {
  const l = corta.toLowerCase();
  if (l.includes('fair') || l.includes('nc') || l.includes('nd')) return false;
  return l.includes('public domain') || l === 'pd' || l.startsWith('pd-') || l.includes('cc0') || /^cc by(-sa)? ?\d/.test(l);
}

async function procesar(e) {
  if (!e.wikidata) return { id: e.id, motivo: 'sin identificador de Wikidata' };
  // Seguro contra identificadores equivocados: el nombre en Wikidata debe coincidir con el nuestro.
  const ent = await api('https://www.wikidata.org/w/api.php', { action: 'wbgetentities', ids: e.wikidata, props: 'labels', languages: 'en|es' });
  const etiquetas = Object.values(ent.entities?.[e.wikidata]?.labels ?? {}).map((l) => l.value.toLowerCase());
  if (!etiquetas.includes(e.nombre.toLowerCase())) {
    return { id: e.id, motivo: `el identificador ${e.wikidata} corresponde a «${etiquetas[0] ?? 'nadie'}», no a ${e.nombre}` };
  }
  const wd = await api('https://www.wikidata.org/w/api.php', { action: 'wbgetclaims', entity: e.wikidata, property: 'P18' });
  const archivo = wd.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (!archivo) return { id: e.id, motivo: 'Wikidata no tiene imagen (P18)' };

  const c = await api('https://commons.wikimedia.org/w/api.php', {
    action: 'query', titles: 'File:' + archivo, prop: 'imageinfo', iiprop: 'extmetadata|url', iiurlwidth: '960',
  });
  const pagina = Object.values(c.query.pages)[0];
  const info = pagina?.imageinfo?.[0];
  if (!info || pagina.imagerepository !== 'local') return { id: e.id, motivo: 'el archivo no está en Wikimedia Commons' };
  const m = info.extmetadata ?? {};
  const licencia = m.LicenseShortName?.value ?? '';
  if (!licenciaAceptada(licencia)) return { id: e.id, motivo: `licencia no aceptada: «${licencia || 'desconocida'}»` };

  const r = await fetch(info.thumburl ?? info.url, { headers: { 'User-Agent': UA } });
  if (!r.ok) return { id: e.id, motivo: `no se pudo descargar (HTTP ${r.status})` };
  const original = Buffer.from(await r.arrayBuffer());
  await pausa(400);
  for (const lado of [160, 480]) {
    await sharp(original)
      .resize(lado, lado, { fit: 'cover', position: 'top' })
      .webp({ quality: 72 })
      .toFile(fileURLToPath(new URL(`public/fotos/${e.id}-${lado}.webp`, RAIZ)));
  }
  return {
    id: e.id,
    credito: {
      autor: limpio(m.Artist?.value) || 'Autor desconocido',
      credito: limpio(m.Credit?.value),
      licencia,
      licenciaUrl: m.LicenseUrl?.value ?? null,
      terminos: limpio(m.UsageTerms?.value),
      enlace: info.descriptionurl,
    },
  };
}

const economistas = JSON.parse(await readFile(new URL('contenido/economistas.json', RAIZ), 'utf8'));
await mkdir(new URL('public/fotos/', RAIZ), { recursive: true });
// Lo que ya se bajó no se vuelve a pedir: así no se abusa de Wikidata ni se pierde un crédito por un error de red.
const previos = JSON.parse(await readFile(new URL('contenido/creditos.json', RAIZ), 'utf8').catch(() => '{}'));
const creditos = {};
const sinFoto = [];
for (const e of economistas) {
  if (e.foto === false) { sinFoto.push(`- ${e.nombre}: marcado para usar iniciales`); continue; }
  if (previos[e.id] && existsSync(new URL(`public/fotos/${e.id}-160.webp`, RAIZ))) { creditos[e.id] = previos[e.id]; console.log('ya estaba:', e.nombre); continue; }
  try {
    const res = await procesar(e);
    if (res.credito) { creditos[e.id] = res.credito; console.log('foto lista:', e.nombre, '·', res.credito.licencia); }
    else { sinFoto.push(`- ${e.nombre}: ${res.motivo}`); console.log('SIN FOTO:', e.nombre, '·', res.motivo); }
  } catch (err) {
    sinFoto.push(`- ${e.nombre}: error (${err.message})`);
    console.log('ERROR:', e.nombre, err.message);
  }
}
await writeFile(new URL('contenido/creditos.json', RAIZ), JSON.stringify(creditos, null, 2) + '\n');
await writeFile(
  new URL('INFORME-FOTOS.md', RAIZ),
  `# Informe de fotos\n\nCon foto libre: ${Object.keys(creditos).length}\n\n## Sin foto (usan avatar de iniciales)\n\n${sinFoto.join('\n') || '- ninguno'}\n`,
);
console.log(`\nListo. ${Object.keys(creditos).length} con foto, ${sinFoto.length} sin foto. Ver INFORME-FOTOS.md`);
