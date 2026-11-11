import './inicio.css';
import { creditos, economistas } from '../datos/contenido.ts';
import { Avatar, traducir } from './Avatar.tsx';

const FUENTES = [
  ['Karl Marx, «El capital», tomo I (1867), caps. 1, 6 y 7', 'https://www.marxists.org/archive/marx/works/1867-c1/'],
  ['Alfred Marshall, «Principios de economía» (1890), libro V, cap. III', 'https://www.econlib.org/library/Marshall/marP.html?chapter_num=31'],
  ['W. S. Jevons, «La teoría de la economía política» (1871), cap. I', 'https://www.econlib.org/library/YPDBooks/Jevons/jvnPE.html?chapter_num=5'],
  ['Adam Smith, «La riqueza de las naciones» (1776), libro I, caps. IV y V', 'https://www.econlib.org/library/Smith/smWN.html?chapter_num=7'],
  ['Exploring Economics: economía neoclásica', 'https://www.exploring-economics.org/es/orientacion/economia-neoclasica/'],
  ['Exploring Economics: economía política marxista', 'https://www.exploring-economics.org/en/orientation/marxist-political-economy/'],
  ['Econlib, «Marginalism» (Steven E. Rhoads)', 'https://www.econlib.org/library/Enc/Marginalism.html'],
];

export function Creditos({ volver }: { volver: () => void }) {
  return (
    <main className="creditos pantalla">
      <button className="enlace" onClick={volver} style={{ justifySelf: 'start' }}>← Volver</button>
      <h1>Créditos y fuentes</h1>

      <section>
        <h2>Fotos</h2>
        <ul className="creditos-lista">
          {economistas.map((e) => {
            const c = creditos[e.id];
            return (
              <li key={e.id}>
                <Avatar id={e.id} credito={false} />
                <div>
                  <h3>{e.nombre}</h3>
                  {c ? (
                    <p>
                      Foto de {c.autor}. Licencia: {c.licenciaUrl ? <a href={c.licenciaUrl} target="_blank" rel="noopener noreferrer">{c.licencia}</a> : traducir(c.licencia)}.{' '}
                      <a href={c.enlace} target="_blank" rel="noopener noreferrer">Ver en Wikimedia Commons</a>.
                    </p>
                  ) : (
                    <p>Sin foto en este duelo: se muestra con sus iniciales y el color de su escuela.</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Fuentes del duelo</h2>
        <ul className="creditos-fuentes">
          {FUENTES.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noopener noreferrer">{t}</a></li>)}
        </ul>
      </section>

      <section>
        <h2>Sobre el juego</h2>
        <p>Ilustraciones y textos originales. Las citas se tradujeron del inglés para este juego. No hay cuentas, anuncios ni rastreo: tu progreso se guarda solo en tu dispositivo.</p>
      </section>
    </main>
  );
}
