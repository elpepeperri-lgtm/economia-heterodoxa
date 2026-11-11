import { creditos, economista, urlFoto } from '../datos/contenido.ts';
import { colorEscuela } from '../motor/catalogo.ts';

/** Foto real con su crédito debajo; si no hay foto libre, iniciales con el color de la escuela. */
export function Avatar({ id, lado = 160, credito = true }: { id: string; lado?: 160 | 480; credito?: boolean }) {
  const e = economista(id);
  const c = creditos[id];
  return (
    <figure className="avatar" style={{ margin: 0, ['--acento' as string]: colorEscuela(e.escuela) }}>
      <div className="avatar-marco">
        {c ? (
          <img src={urlFoto(id, lado)} width={lado} height={lado} loading="lazy" decoding="async" alt={`Retrato de ${e.nombre}`} />
        ) : (
          <span className="avatar-iniciales" role="img" aria-label={`${e.nombre} (sin foto libre: iniciales)`}>{e.iniciales}</span>
        )}
      </div>
      {credito && c && (
        <figcaption className="avatar-credito">
          Foto: {c.autor}. {c.licenciaUrl ? <a href={c.licenciaUrl} target="_blank" rel="noopener noreferrer">{c.licencia}</a> : traducir(c.licencia)}.
        </figcaption>
      )}
    </figure>
  );
}

export const traducir = (licencia: string) => (licencia.toLowerCase() === 'public domain' ? 'Dominio público' : licencia);
