import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import './piezas.css';

export type Termino = { termino: string; significado: string };
type Contexto = { patron: RegExp | null; terminos: Termino[]; abrir: (t: Termino) => void };
const Ctx = createContext<Contexto>({ patron: null, terminos: [], abrir: () => {} });
const escapar = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Envuelve una pantalla: las palabras del glosario que aparezcan dentro de <T> se pueden tocar,
 * y su significado sale en una hoja al pie. `reinicio` cierra la hoja cuando cambia (p. ej. al pasar de pregunta).
 */
export function Glosario({ terminos, reinicio, children }: { terminos: Termino[]; reinicio?: unknown; children: ReactNode }) {
  const [abierto, setAbierto] = useState<Termino | null>(null);
  const valor = useMemo<Contexto>(() => {
    const orden = [...terminos].sort((x, y) => y.termino.length - x.termino.length);
    const patron = orden.length ? new RegExp(`(?<![\\p{L}])(${orden.map((t) => escapar(t.termino)).join('|')})(?![\\p{L}])`, 'giu') : null;
    return { patron, terminos: orden, abrir: setAbierto };
  }, [terminos]);
  useEffect(() => setAbierto(null), [reinicio]);

  return (
    <Ctx.Provider value={valor}>
      {children}
      {abierto && (
        <div className="glosa" role="dialog" aria-label={`Qué significa ${abierto.termino}`}>
          <div>
            <p className="rotulo">Qué significa</p>
            <h3>{abierto.termino}</h3>
            <p>{abierto.significado}</p>
          </div>
          <button className="boton" data-clase="linea" onClick={() => setAbierto(null)} autoFocus>Entendido</button>
        </div>
      )}
    </Ctx.Provider>
  );
}

/** Texto con las palabras del glosario convertidas en botones. */
export function T({ children }: { children: string }) {
  const { patron, terminos, abrir } = useContext(Ctx);
  if (!patron) return <>{children}</>;
  const partes: ReactNode[] = [];
  let ultimo = 0;
  for (const m of children.matchAll(patron)) {
    const t = terminos.find((x) => x.termino.toLowerCase() === m[0].toLowerCase())!;
    partes.push(children.slice(ultimo, m.index));
    partes.push(<button key={m.index} type="button" className="termino" onClick={() => abrir(t)} aria-label={`${m[0]}: ver qué significa`}>{m[0]}</button>);
    ultimo = m.index + m[0].length;
  }
  partes.push(children.slice(ultimo));
  return <>{partes}</>;
}

/** Abre un término desde fuera de un texto (por ejemplo, en la pantalla de reglas). */
export function useGlosario() {
  const { terminos, abrir } = useContext(Ctx);
  return (termino: string) => { const t = terminos.find((x) => x.termino === termino); if (t) abrir(t); };
}
