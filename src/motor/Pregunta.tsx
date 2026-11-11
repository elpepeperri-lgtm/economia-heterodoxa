import type { ReactNode, Ref } from 'react';
import './piezas.css';
import type { Lado, TPregunta } from '../datos/esquema.ts';
import { T } from './Glosario.tsx';

const BIEN = ['¡Eso es!', '¡Bien visto!', '¡Exacto!', '¡De una!', '¡Ojo fino!'];
const CASI = ['Casi.', 'Esa tentaba.', 'Buena sospecha, pero no.'];
const LETRAS = ['A', 'B', 'C', 'D'];

/** Frase de ánimo que va rotando para que la celebración no canse. */
export const fraseBien = (n: number) => BIEN[n % BIEN.length];

/**
 * Una pregunta de cualquier tipo (quien, opcion, vf, supuesto) con su devolución.
 * No sabe nada de duelos: la puede usar cualquier modo de juego.
 * - `elegida`: índice de la opción tocada, o null si aún no responde.
 * - `n`: número de orden, solo para variar las frases.
 * - `avatar`: retrato opcional junto a la frase citada.
 */
export function Pregunta({ p, elegida, n, alResponder, alSeguir, cabecera, avatar, tituloRef, devolucionRef }: {
  p: TPregunta; elegida: number | null; n: number;
  alResponder: (i: number) => void; alSeguir: () => void;
  cabecera?: ReactNode; avatar?: ReactNode;
  tituloRef?: Ref<HTMLHeadingElement>; devolucionRef?: Ref<HTMLDivElement>;
}) {
  const correcta = p.opciones.findIndex((o) => o.correcta);
  const acerto = elegida === correcta;
  const respondida = elegida !== null;
  // De quién es la frase: en «detecta el supuesto» habla el lado contrario al que ataca.
  const autorVisible = respondida || p.tipo !== 'quien';
  const de: Lado | 'nadie' = !autorVisible ? 'nadie' : p.tipo === 'supuesto' ? (p.ataca === 'a' ? 'b' : 'a') : p.ataca;

  return (
    <>
      {cabecera}
      <h2 ref={tituloRef} tabIndex={-1} className="enunciado"><T>{p.enunciado}</T></h2>

      {p.cita && (
        <blockquote className="cita" data-tipo={p.cita.tipo} data-de={de}>
          {avatar && <div className="cita-avatar">{avatar}</div>}
          <p>{p.cita.tipo === 'cita' ? <>«<T>{p.cita.texto}</T>»</> : <T>{p.cita.texto}</T>}</p>
          {autorVisible && (
            <footer>
              {p.cita.tipo === 'cita'
                ? <>{p.cita.autor}, <i>{p.cita.obra}</i> ({p.cita.anio}). {p.cita.nota}.</>
                : <>Es la idea con nuestras palabras, no una cita textual.</>}
            </footer>
          )}
        </blockquote>
      )}

      <div className="opciones" data-tipo={p.tipo}>
        {p.opciones.map((o, i) => {
          const estado = !respondida ? undefined : i === correcta ? 'bien' : i === elegida ? 'mal' : 'apagada';
          return (
            <button key={i} className="opcion" data-estado={estado} disabled={respondida} onClick={() => alResponder(i)}>
              <span className="opcion-letra" aria-hidden="true">{estado === 'bien' ? '✓' : estado === 'mal' ? '✕' : LETRAS[i]}</span>
              <span>{o.texto}</span>
              {estado === 'bien' && <span className="solo-lector"> (respuesta correcta)</span>}
              {estado === 'mal' && <span className="solo-lector"> (tu respuesta, no era esta)</span>}
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {respondida && (
          <div className="devolucion" ref={devolucionRef} data-acerto={acerto}>
            <h3>{acerto ? fraseBien(n) : CASI[n % CASI.length]}</h3>
            <p><T>{p.opciones[elegida].porque}</T></p>
            {!acerto && <p><b>Era:</b> {p.opciones[correcta].texto}</p>}
            <p className="idea-clave"><span className="rotulo">Para llevar</span><T>{p.explicacion}</T></p>
            <button className="boton" onClick={alSeguir}>Seguir</button>
            <p className="fuentes">
              {p.fuentes.map((f, i) => (
                <a key={f} href={f} target="_blank" rel="noopener noreferrer">Fuente{p.fuentes.length > 1 ? ` ${i + 1}` : ''}</a>
              ))}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/** Rayitas de avance dentro de una tanda de preguntas. */
export function Avance({ total, actual }: { total: number; actual: number }) {
  return (
    <ol className="puntos" aria-label={`Pregunta ${actual + 1} de ${total}`}>
      {Array.from({ length: total }, (_, i) => <li key={i} data-estado={i < actual ? 'hecha' : i === actual ? 'actual' : 'falta'} />)}
    </ol>
  );
}
