import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import './modos.css';
import modosJson from '../../contenido/modos.json';
import type { TModos } from '../datos/esquema.ts';
import { economista } from '../datos/contenido.ts';
import { colorEscuela, ESCUELAS, type EscuelaId } from '../motor/catalogo.ts';
import { Avance, fraseBien, Pregunta } from '../motor/Pregunta.tsx';
import { cargar, registrarModo, registrarRespuesta, type Progreso } from '../motor/progreso.ts';
import { Personaje } from '../personajes/Personaje.tsx';
import { Avatar } from './Avatar.tsx';

// Los tres modos cortos: «¿Quién es?», «Unir» y «Lecturas cortas». Comparten marco, cierre y contenido (contenido/modos.json).
const modos = modosJson as TModos;
export type ModoId = 'quien' | 'unir' | 'lecturas';

function barajar<X>(lista: readonly X[]): X[] {
  const r = [...lista];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Lleva la devolución a la vista cuando aparece. */
function useALaVista(activo: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activo) return;
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => ref.current?.scrollIntoView({ block: 'start', behavior: suave ? 'smooth' : 'auto' }), 380);
    return () => clearTimeout(t);
  }, [activo]);
  return ref;
}

function Marco({ titulo, total, actual, alSalir, children }: { titulo: string; total?: number; actual?: number; alSalir: () => void; children: ReactNode }) {
  return (
    <main className="modo pantalla">
      <header className="modo-barra">
        <button className="modo-salir" onClick={alSalir} aria-label="Salir al inicio">✕</button>
        <p className="rotulo">{titulo}</p>
        {total ? <Avance total={total} actual={actual ?? 0} /> : <span />}
      </header>
      <div className="modo-cuerpo">{children}</div>
    </main>
  );
}

function Fuentes({ lista }: { lista: string[] }) {
  return (
    <p className="fuentes">
      {lista.map((f, i) => <a key={f} href={f} target="_blank" rel="noopener noreferrer">Fuente{lista.length > 1 ? ` ${i + 1}` : ''}</a>)}
    </p>
  );
}

function Cierre({ titulo, detalle, xp, children }: { titulo: string; detalle: string; xp: number; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="modo-paso modo-cierre">
      <h2 ref={ref} tabIndex={-1} className="modo-titulo">{titulo}</h2>
      <p className="modo-xp">+{xp} <span>XP</span></p>
      <p>{detalle}</p>
      {children}
    </div>
  );
}

/* ---------- ¿Quién es? ---------- */

const XP_PISTA = [15, 10, 5];

function QuienEs({ alSalir }: { alSalir: () => void }) {
  const [vuelta, setVuelta] = useState(0);
  const orden = useMemo(() => barajar(modos.quienes), [vuelta]);
  const [i, setI] = useState(0);
  const [pistas, setPistas] = useState(1);
  const [elegida, setElegida] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const titulo = useRef<HTMLHeadingElement>(null);
  const fin = i >= orden.length;
  const ronda = orden[Math.min(i, orden.length - 1)];
  const opciones = useMemo(
    () => barajar([ronda.economista, ...barajar(modos.quienes.map((q) => q.economista).filter((e) => e !== ronda.economista)).slice(0, 3)]),
    [ronda],
  );
  const devolucion = useALaVista(elegida !== null);
  useEffect(() => { if (!fin) titulo.current?.focus(); }, [i, fin]);
  useEffect(() => { if (fin) void registrarModo('quien', xp, aciertos); }, [fin]); // eslint-disable-line

  if (fin) {
    return (
      <Marco titulo="¿Quién es?" alSalir={alSalir}>
        <Cierre titulo="¡Ronda terminada!" xp={xp} detalle={`Reconociste a ${aciertos} de ${orden.length}. Con menos pistas, más puntos.`}>
          <button className="boton" onClick={() => { setVuelta(vuelta + 1); setI(0); setPistas(1); setElegida(null); setXp(0); setAciertos(0); }}>Otra ronda</button>
          <button className="boton" data-clase="linea" onClick={alSalir}>Volver al inicio</button>
        </Cierre>
      </Marco>
    );
  }

  const e = economista(ronda.economista);
  const acerto = elegida === ronda.economista;
  function responder(id: string) {
    const bien = id === ronda.economista;
    setElegida(id);
    if (bien) { setXp(xp + XP_PISTA[pistas - 1]); setAciertos(aciertos + 1); }
    void registrarRespuesta(`quien-${ronda.economista}`, bien);
  }

  return (
    <Marco titulo="¿Quién es?" total={orden.length} actual={i} alSalir={alSalir}>
      <div className="modo-paso" key={i}>
        <h2 ref={titulo} tabIndex={-1} className="enunciado">¿Quién soy?</h2>
        <ol className="pistas" aria-live="polite">
          {ronda.pistas.slice(0, elegida ? 3 : pistas).map((p, k) => (
            <li key={k}><span className="pista-num" aria-hidden="true">{k + 1}</span><span><span className="solo-lector">Pista {k + 1}: </span>{p}</span></li>
          ))}
        </ol>
        {!elegida && pistas < 3 && (
          <button className="boton" data-clase="linea" onClick={() => setPistas(pistas + 1)}>Dame otra pista</button>
        )}
        {!elegida && <p className="modo-nota">Si aciertas ahora ganas {XP_PISTA[pistas - 1]} XP.{pistas < 3 && ` Con otra pista, ${XP_PISTA[pistas]}.`}</p>}
        <div className="opciones" data-tipo="quien">
          {opciones.map((id, k) => {
            const estado = !elegida ? undefined : id === ronda.economista ? 'bien' : id === elegida ? 'mal' : 'apagada';
            return (
              <button key={id} className="opcion" data-estado={estado} disabled={!!elegida} onClick={() => responder(id)}>
                <span className="opcion-letra" aria-hidden="true">{estado === 'bien' ? '✓' : estado === 'mal' ? '✕' : 'ABCD'[k]}</span>
                <span>{economista(id).nombre.split(' ').pop()}</span>
                {estado === 'bien' && <span className="solo-lector"> (respuesta correcta)</span>}
                {estado === 'mal' && <span className="solo-lector"> (tu respuesta, no era esta)</span>}
              </button>
            );
          })}
        </div>
        <div aria-live="polite">
          {elegida && (
            <div className="devolucion" ref={devolucion} data-acerto={acerto}>
              <h3>{acerto ? fraseBien(i) : 'Casi.'}</h3>
              <div className="ficha-quien" style={{ ['--acento' as string]: colorEscuela(e.escuela) }}>
                <Avatar id={e.id} />
                <div>
                  <p className="ficha-nombre">{e.nombre}</p>
                  <p className="rotulo">{e.nace}–{e.muere} · {ESCUELAS[e.escuela].nombre}</p>
                  <p>{e.aporte}</p>
                </div>
              </div>
              <button className="boton" onClick={() => { setI(i + 1); setPistas(1); setElegida(null); }}>Seguir</button>
              <Fuentes lista={ronda.fuentes} />
            </div>
          )}
        </div>
      </div>
    </Marco>
  );
}

/* ---------- Unir ---------- */

function Unir({ alSalir }: { alSalir: () => void }) {
  const [t, setT] = useState(0);
  const [xp, setXp] = useState(0);
  const [limpios, setLimpios] = useState(0);
  const fin = t >= modos.unir.length;
  const tablero = modos.unir[Math.min(t, modos.unir.length - 1)];
  const derecha = useMemo(() => barajar(tablero.pares.map((p) => p.der)), [tablero]);
  const [sel, setSel] = useState<number | null>(null);
  /** Para cada elemento de la izquierda ya unido: el número de pareja (1, 2, 3…). */
  const [hechas, setHechas] = useState<Record<number, number>>({});
  const [mal, setMal] = useState<number | null>(null);
  const [fallos, setFallos] = useState(0);
  const titulo = useRef<HTMLHeadingElement>(null);
  const completo = Object.keys(hechas).length === tablero.pares.length;
  const devolucion = useALaVista(completo);
  useEffect(() => { if (!fin) titulo.current?.focus(); }, [t, fin]);
  useEffect(() => { if (fin) void registrarModo('unir', xp, limpios); }, [fin]); // eslint-disable-line

  if (fin) {
    return (
      <Marco titulo="Unir" alSalir={alSalir}>
        <Cierre titulo="¡Todo unido!" xp={xp} detalle={`Resolviste ${limpios} de ${modos.unir.length} tableros sin equivocarte.`}>
          <button className="boton" onClick={() => { setT(0); setXp(0); setLimpios(0); }}>Jugar otra vez</button>
          <button className="boton" data-clase="linea" onClick={alSalir}>Volver al inicio</button>
        </Cierre>
      </Marco>
    );
  }

  const numeroDe = (texto: string) => { const k = tablero.pares.findIndex((p) => p.der === texto); return hechas[k]; };
  function tocarDerecha(j: number) {
    if (sel === null) return;
    if (tablero.pares[sel].der === derecha[j]) {
      const nuevas = { ...hechas, [sel]: Object.keys(hechas).length + 1 };
      setHechas(nuevas);
      setSel(null);
      if (Object.keys(nuevas).length === tablero.pares.length) {
        setXp(xp + Math.max(tablero.pares.length * 2, tablero.pares.length * 5 - fallos * 3));
        if (fallos === 0) setLimpios(limpios + 1);
        void registrarRespuesta(tablero.id, fallos === 0);
      }
    } else {
      setFallos(fallos + 1);
      setMal(j);
      setTimeout(() => setMal(null), 450);
    }
  }
  function siguiente() { setT(t + 1); setSel(null); setHechas({}); setFallos(0); }

  return (
    <Marco titulo="Unir" total={modos.unir.length} actual={t} alSalir={alSalir}>
      <div className="modo-paso" key={t}>
        <h2 ref={titulo} tabIndex={-1} className="modo-titulo">{tablero.titulo}</h2>
        <p className="modo-nota" aria-live="polite">
          {completo ? 'Tablero completo.' : sel === null ? 'Toca uno de la izquierda y luego su pareja de la derecha.' : `Elegiste «${tablero.pares[sel].izq}». Ahora toca su pareja.`}
        </p>
        <div className="unir">
          <div className="unir-col">
            {tablero.pares.map((p, k) => (
              <button key={k} className="ficha-unir" data-estado={hechas[k] ? 'hecha' : sel === k ? 'elegida' : undefined} disabled={!!hechas[k]} aria-pressed={sel === k} onClick={() => setSel(sel === k ? null : k)}>
                {hechas[k] && <span className="unir-num" aria-hidden="true">{hechas[k]}</span>}
                <span>{p.izq}</span>
                {hechas[k] && <span className="solo-lector"> (unido, pareja {hechas[k]})</span>}
              </button>
            ))}
          </div>
          <div className="unir-col">
            {derecha.map((d, j) => {
              const n = numeroDe(d);
              return (
                <button key={d} className="ficha-unir" data-lado="der" data-estado={n ? 'hecha' : mal === j ? 'mal' : undefined} disabled={!!n || sel === null} onClick={() => tocarDerecha(j)}>
                  {n && <span className="unir-num" aria-hidden="true">{n}</span>}
                  <span>{d}</span>
                  {n && <span className="solo-lector"> (unido, pareja {n})</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div aria-live="polite">
          {completo && (
            <div className="devolucion" ref={devolucion} data-acerto="true">
              <h3>{fallos === 0 ? '¡Sin un fallo!' : '¡Completo!'}</h3>
              <p className="idea-clave"><span className="rotulo">Para llevar</span>{tablero.explicacion}</p>
              <button className="boton" onClick={siguiente}>Seguir</button>
              <Fuentes lista={tablero.fuentes} />
            </div>
          )}
        </div>
      </div>
    </Marco>
  );
}

/* ---------- Lecturas cortas ---------- */

function Lecturas({ alSalir }: { alSalir: () => void }) {
  const [prog, setProg] = useState<Progreso | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [paso, setPaso] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [fin, setFin] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);
  const devolucion = useALaVista(elegida !== null);
  useEffect(() => { void cargar().then((p) => setProg({ ...p })); }, [id]);
  useEffect(() => { titulo.current?.focus(); }, [id, paso, fin]);

  const lectura = modos.lecturas.find((l) => l.id === id);
  if (!lectura) {
    return (
      <Marco titulo="Lecturas cortas" alSalir={alSalir}>
        <div className="modo-paso">
          <h2 ref={titulo} tabIndex={-1} className="modo-titulo">Dos minutos por escuela</h2>
          <p>Tres pantallas y una pregunta. Elige por dónde empezar.</p>
          <ul className="lecturas">
            {modos.lecturas.map((l) => (
              <li key={l.id}>
                <button className="lectura-tarjeta" style={{ ['--acento' as string]: colorEscuela(l.escuelaId) }} onClick={() => { setId(l.id); setPaso(0); setElegida(null); setFin(false); }}>
                  <span className="lectura-cara" aria-hidden="true"><Personaje id={l.economista} mira="der" escuela={l.escuelaId} /></span>
                  <span className="lectura-texto">
                    <span className="rotulo">{ESCUELAS[l.escuelaId as EscuelaId].nombre}</span>
                    <span className="lectura-nombre">{l.titulo}</span>
                    {prog?.modos[l.id] && <span className="lectura-leida">✓ Leída</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Marco>
    );
  }

  const total = lectura.pantallas.length + 1;
  const correcta = lectura.pregunta.opciones.findIndex((o) => o.correcta);
  const acerto = elegida === correcta;
  const xp = 10 + (acerto ? 10 : 0);
  const rotulo = `Lectura · ${ESCUELAS[lectura.escuelaId as EscuelaId].nombre}`;

  if (fin) {
    return (
      <Marco titulo={rotulo} alSalir={alSalir}>
        <Cierre titulo="¡Lectura hecha!" xp={xp} detalle={acerto ? 'Leíste y acertaste la pregunta.' : 'Leíste hasta el final. La pregunta queda para repasar.'}>
          <button className="boton" onClick={() => setId(null)}>Otra lectura</button>
          <button className="boton" data-clase="linea" onClick={alSalir}>Volver al inicio</button>
          <Fuentes lista={lectura.fuentes} />
        </Cierre>
      </Marco>
    );
  }

  const pantalla = lectura.pantallas[paso];
  return (
    <Marco titulo={rotulo} total={total} actual={paso} alSalir={alSalir}>
      <div className="modo-paso" key={paso} style={{ ['--acento' as string]: colorEscuela(lectura.escuelaId) }}>
        {pantalla ? (
          <>
            <article className="hoja">
              <p className="rotulo">{lectura.titulo} · {paso + 1} de {lectura.pantallas.length}</p>
              <h2 ref={titulo} tabIndex={-1}>{pantalla.titulo}</h2>
              <p>{pantalla.texto}</p>
            </article>
            <button className="boton" onClick={() => setPaso(paso + 1)}>{paso + 1 < lectura.pantallas.length ? 'Seguir' : 'A la pregunta'}</button>
            {paso > 0 && <button className="enlace" onClick={() => setPaso(paso - 1)}>Volver a la pantalla anterior</button>}
          </>
        ) : (
          <Pregunta
            p={lectura.pregunta} elegida={elegida} n={0} tituloRef={titulo} devolucionRef={devolucion}
            alResponder={(k) => { setElegida(k); void registrarRespuesta(lectura.pregunta.id, k === correcta); }}
            alSeguir={() => { void registrarModo(lectura.id, xp, acerto ? 1 : 0); setFin(true); }}
          />
        )}
      </div>
    </Marco>
  );
}

export default function Modos({ modo, alSalir }: { modo: ModoId; alSalir: () => void }) {
  if (modo === 'quien') return <QuienEs alSalir={alSalir} />;
  if (modo === 'unir') return <Unir alSalir={alSalir} />;
  return <Lecturas alSalir={alSalir} />;
}
