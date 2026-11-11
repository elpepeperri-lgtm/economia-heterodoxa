import './inicio.css';
import { creditos, economistas, indiceDuelos } from '../datos/contenido.ts';
import { Avatar, traducir } from './Avatar.tsx';

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
        <h2>Fuentes</h2>
        {indiceDuelos.map((d) => (
          <div key={d.id}>
            <h3 style={{ margin: '10px 0 6px' }}>{d.titulo}</h3>
            <ul className="creditos-fuentes">
              {d.bibliografia.map((b) => <li key={b.url}><a href={b.url} target="_blank" rel="noopener noreferrer">{b.titulo}</a></li>)}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Sobre el juego</h2>
        <p>Ilustraciones y textos originales. Las citas se tradujeron del inglés para este juego. No hay cuentas, anuncios ni rastreo: tu progreso se guarda solo en tu dispositivo.</p>
      </section>
    </main>
  );
}
