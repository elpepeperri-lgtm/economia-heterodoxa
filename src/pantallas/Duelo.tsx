import { useEffect, useRef, useState } from 'react';
import './duelo.css';
import dueloJson from '../../contenido/duelos/valor.json';
import type { Lado, TDuelo, TPregunta } from '../datos/esquema.ts';
import { economista } from '../datos/contenido.ts';
import { registrarDuelo } from '../motor/progreso.ts';
import { Personaje, type Estado } from '../personajes/Personaje.tsx';
import { Fabrica, Objeto, Pizarra, Proyectil } from '../escenas/Escenas.tsx';
import { Avatar } from './Avatar.tsx';

const duelo = dueloJson as TDuelo;
const BASE = 20;
const XP_ACIERTO = 10;
const XP_FINAL = 20;
const BIEN = ['Eso es.', 'Bien visto.', 'Exacto.', 'De una.', 'Ojo fino.'];
const CASI = ['Casi.', 'Esa tentaba.', 'Buena sospecha, pero no.'];
const LETRAS = ['A', 'B', 'C', 'D'];
const acota = (n: number) => Math.max(0, Math.min(100, n));
const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Fase = 'entrada' | 'caso' | 'pregunta' | 'veredicto' | 'tregua' | 'fin';

export default function Duelo({ alSalir }: { alSalir: () => void }) {
  const [fase, setFase] = useState<Fase>('entrada');
  const [iCaso, setICaso] = useState(0);
  const [iPreg, setIPreg] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [poder, setPoder] = useState({ a: BASE, b: BASE });
  const [est, setEst] = useState<{ a: Estado; b: Estado }>({ a: 'reposo', b: 'reposo' });
  const [aciertos, setAciertos] = useState(0);
  const [paso, setPaso] = useState(0);
  const [proy, setProy] = useState<Lado>('a');
  const [xpVisto, setXpVisto] = useState(0);

  const arena = useRef<HTMLDivElement>(null);
  const bala = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const relojes = useRef<number[]>([]);
  const devolucion = useRef<HTMLDivElement>(null);

  const caso = duelo.casos[iCaso];
  const preguntas = caso.preguntas.filter((p) => p.estado === 'ok');
  const p: TPregunta = preguntas[iPreg];
  const total = duelo.casos.reduce((n, c) => n + c.preguntas.filter((q) => q.estado === 'ok').length, 0);
  const xp = aciertos * XP_ACIERTO + XP_FINAL;
  const nombre = { a: duelo.a.nombreCorto, b: duelo.b.nombreCorto };

  const luego = (ms: number, f: () => void) => { relojes.current.push(window.setTimeout(f, sinMovimiento() ? 0 : ms)); };
  useEffect(() => () => relojes.current.forEach(clearTimeout), []);

  // Al cambiar de paso: arriba del panel y foco en el título (teclado y lectores de pantalla).
  useEffect(() => {
    panel.current?.scrollTo(0, 0);
    titulo.current?.focus({ preventScroll: true });
  }, [fase, iCaso, iPreg, paso]);

  useEffect(() => {
    if (fase !== 'fin') return;
    void registrarDuelo(duelo.id, xp, aciertos, duelo.herramienta.nombre);
    if (sinMovimiento()) { setXpVisto(xp); return; }
    const inicio = performance.now();
    let cuadro = 0;
    const tic = (t: number) => {
      const k = Math.min(1, (t - inicio) / 900);
      setXpVisto(Math.round(xp * (1 - (1 - k) ** 3)));
      if (k < 1) cuadro = requestAnimationFrame(tic);
    };
    cuadro = requestAnimationFrame(tic);
    return () => cancelAnimationFrame(cuadro);
  }, [fase]); // eslint-disable-line react-hooks/exhaustive-deps

  function lanzar(lado: Lado) {
    setProy(lado);
    const el = bala.current;
    const w = arena.current?.clientWidth ?? 360;
    if (!el || sinMovimiento()) return;
    const d = lado === 'a' ? 1 : -1;
    const x0 = -d * w * 0.26;
    const x1 = d * w * 0.3;
    el.animate(
      [
        { transform: `translate(${x0}px, 0) rotate(0deg) scale(.5)`, opacity: 0 },
        { transform: `translate(${x0 * 0.7}px, -46px) rotate(${d * 140}deg) scale(1)`, opacity: 1, offset: 0.2 },
        { transform: `translate(0, -96px) rotate(${d * 320}deg) scale(1.15)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${x1}px, -36px) rotate(${d * 560}deg) scale(1)`, opacity: 1, offset: 0.9 },
        { transform: `translate(${x1}px, -36px) rotate(${d * 580}deg) scale(1.7)`, opacity: 0 },
      ],
      { duration: 680, easing: 'ease-in-out' },
    );
  }

  function responder(i: number) {
    if (elegida !== null) return;
    setElegida(i);
    const acerto = p.opciones[i].correcta;
    if (acerto) setAciertos((n) => n + 1);
    const ataca = p.ataca;
    const recibe: Lado = ataca === 'a' ? 'b' : 'a';
    setEst({ a: 'reposo', b: 'reposo', [ataca]: 'atacar' } as { a: Estado; b: Estado });
    luego(180, () => lanzar(ataca));
    luego(760, () => {
      setPoder((v) => ({ a: acota(v.a + p.mueve.a), b: acota(v.b + p.mueve.b) }));
      setEst({ [ataca]: 'reposo', [recibe]: 'golpe' } as { a: Estado; b: Estado });
    });
    luego(1400, () => setEst({ [ataca]: acerto ? 'celebrar' : 'hablar', [recibe]: 'reposo' } as { a: Estado; b: Estado }));
    luego(3000, () => setEst({ a: 'reposo', b: 'reposo' }));
    // Lleva la explicación a la vista cuando ya pasó el golpe.
    luego(1000, () => panel.current?.scrollTo({ top: (devolucion.current?.offsetTop ?? 0) - 12, behavior: sinMovimiento() ? 'auto' : 'smooth' }));
  }

  function seguir() {
    relojes.current.forEach(clearTimeout);
    setElegida(null);
    if (fase === 'entrada') { setFase('caso'); return; }
    if (fase === 'caso') { setFase('pregunta'); setEst({ a: 'pensar', b: 'pensar' }); return; }
    if (fase === 'pregunta') {
      if (iPreg + 1 < preguntas.length) { setIPreg(iPreg + 1); setEst({ a: 'pensar', b: 'pensar' }); }
      else { setFase('veredicto'); setEst({ a: poder.a >= poder.b ? 'hablar' : 'reposo', b: poder.b > poder.a ? 'hablar' : 'reposo' }); }
      return;
    }
    if (fase === 'veredicto') {
      if (iCaso + 1 < duelo.casos.length) {
        setICaso(iCaso + 1); setIPreg(0); setPoder({ a: BASE, b: BASE }); setEst({ a: 'reposo', b: 'reposo' }); setFase('caso');
      } else { setFase('tregua'); setPaso(0); setEst({ a: 'mano', b: 'mano' }); }
      return;
    }
    if (fase === 'tregua') {
      if (paso < 2) setPaso(paso + 1);
      else { setFase('fin'); setEst({ a: 'celebrar', b: 'celebrar' }); }
    }
  }

  const acerto = elegida !== null && p.opciones[elegida].correcta;
  const correcta = p.opciones.findIndex((o) => o.correcta);
  const enPelea = fase === 'caso' || fase === 'pregunta' || fase === 'veredicto';

  return (
    <main className="duelo pantalla" data-fase={fase}>
      <div className="arena" ref={arena} data-juntos={fase === 'tregua' || fase === 'fin' || undefined}>
        <div className="esc esc-a"><Fabrica /></div>
        <div className="esc esc-b"><Pizarra /></div>

        <button className="salir" onClick={alSalir} aria-label="Salir del duelo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19" /></svg>
        </button>

        {enPelea && (
          <div className="barras" role="group" aria-label={`Poder explicativo en este caso: ${nombre.a} ${poder.a} de 100, ${nombre.b} ${poder.b} de 100`}>
            {(['a', 'b'] as const).map((l) => (
              <div className="barra" data-lado={l} key={l} aria-hidden="true">
                <span className="barra-nombre">{nombre[l]} <b>{poder[l]}</b></span>
                <span className="barra-pista"><span className="barra-relleno" style={{ transform: `scaleX(${poder[l] / 100})` }} /></span>
              </div>
            ))}
            <span className="barras-pie rotulo" aria-hidden="true">poder explicativo</span>
          </div>
        )}

        {fase === 'entrada' && <div className="sello" aria-hidden="true">vs</div>}

        <div className="lado lado-a"><Personaje quien="marx" estado={est.a} /></div>
        <div className="lado lado-b"><Personaje quien="marshall" estado={est.b} /></div>

        {enPelea && (
          <div className="objeto" key={caso.id}>
            <Objeto tipo={caso.objeto} />
          </div>
        )}
        <div className="bala" ref={bala}><Proyectil lado={proy} /></div>
      </div>

      <div className="panel" ref={panel}>
        {fase === 'entrada' && (
          <section className="paso">
            <p className="rotulo">Duelo · 3 asaltos · unos 4 minutos</p>
            <h1 ref={titulo} tabIndex={-1} className="pregunta-grande">{duelo.pregunta}</h1>
            <div className="fichas">
              {(['a', 'b'] as const).map((l) => {
                const e = economista(duelo[l].economista);
                return (
                  <div className="ficha" data-lado={l} key={l}>
                    <Avatar id={e.id} />
                    <h2>{e.nombre}</h2>
                    <p className="ficha-dato">{e.nace}–{e.muere} · {duelo[l].escuela}</p>
                    <p className="ficha-lema">«{duelo[l].lema}»</p>
                  </div>
                );
              })}
            </div>
            <p className="nota">Aquí no gana nadie. Tú eres el juez: en cada caso vas a ver qué tan bien explica cada escuela, y dónde se queda corta.</p>
            <button className="boton" onClick={seguir}>Que empiece</button>
          </section>
        )}

        {fase === 'caso' && (
          <section className="paso" key={caso.id}>
            <p className="rotulo">Asalto {iCaso + 1} de {duelo.casos.length} · {caso.mecanica}</p>
            <h2 ref={titulo} tabIndex={-1} className="titulo-caso">{caso.titulo}</h2>
            <p className="historia">{caso.historia}</p>
            <button className="boton" onClick={seguir}>Empezar el asalto</button>
          </section>
        )}

        {fase === 'pregunta' && (
          <section className="paso" key={p.id}>
            <div className="cabecera-pregunta">
              <p className="rotulo">{caso.mecanica}</p>
              <ol className="puntos" aria-label={`Pregunta ${iPreg + 1} de ${preguntas.length}`}>
                {preguntas.map((q, i) => <li key={q.id} data-estado={i < iPreg ? 'hecha' : i === iPreg ? 'actual' : 'falta'} />)}
              </ol>
            </div>
            <h2 ref={titulo} tabIndex={-1} className="enunciado">{p.enunciado}</h2>

            {p.cita && (
              <blockquote className="cita" data-tipo={p.cita.tipo}>
                {p.avatar && <div className="cita-avatar"><Avatar id={p.avatar} credito={false} /></div>}
                <p>{p.cita.tipo === 'cita' ? `«${p.cita.texto}»` : p.cita.texto}</p>
                {(elegida !== null || p.tipo !== 'quien') && (
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
                const estado = elegida === null ? undefined : i === correcta ? 'bien' : i === elegida ? 'mal' : 'apagada';
                return (
                  <button key={i} className="opcion" data-estado={estado} disabled={elegida !== null} onClick={() => responder(i)}>
                    <span className="opcion-letra" aria-hidden="true">{estado === 'bien' ? '✓' : estado === 'mal' ? '✕' : LETRAS[i]}</span>
                    <span>{o.texto}</span>
                    {estado === 'bien' && <span className="solo-lector"> (respuesta correcta)</span>}
                    {estado === 'mal' && <span className="solo-lector"> (tu respuesta, no era esta)</span>}
                  </button>
                );
              })}
            </div>

            <div aria-live="polite">
              {elegida !== null && (
                <div className="devolucion" ref={devolucion} data-acerto={acerto}>
                  <h3>{acerto ? BIEN[(iCaso * 3 + iPreg) % BIEN.length] : CASI[(iCaso + iPreg) % CASI.length]}</h3>
                  <p>{p.opciones[elegida].porque}</p>
                  {!acerto && <p><b>La respuesta:</b> {p.opciones[correcta].texto}. {p.opciones[correcta].porque}</p>}
                  <p className="idea-clave">{p.explicacion}</p>
                  <p className="fuentes">
                    {p.fuentes.map((f, i) => (
                      <a key={f} href={f} target="_blank" rel="noopener noreferrer">Fuente{p.fuentes.length > 1 ? ` ${i + 1}` : ''}</a>
                    ))}
                  </p>
                  <button className="boton" onClick={seguir}>Seguir</button>
                </div>
              )}
            </div>
          </section>
        )}

        {fase === 'veredicto' && (
          <section className="paso">
            <p className="rotulo">Así quedó el asalto {iCaso + 1}</p>
            <h2 ref={titulo} tabIndex={-1} className="titulo-caso">
              {poder.a === poder.b ? 'Empate' : Math.abs(poder.a - poder.b) <= 10 ? 'Casi parejo' : `Este caso lo explica mejor ${poder.a > poder.b ? nombre.a : nombre.b}`}
            </h2>
            <p className="marcador">{nombre.a} <b>{poder.a}</b> · {nombre.b} <b>{poder.b}</b></p>
            <p className="historia">{caso.veredicto}</p>
            <button className="boton" onClick={seguir}>{iCaso + 1 < duelo.casos.length ? 'Siguiente caso' : 'Tregua'}</button>
          </section>
        )}

        {fase === 'tregua' && (
          <section className="paso" key={paso}>
            <p className="rotulo">Tregua · {paso + 1} de 3</p>
            {paso === 0 && (
              <>
                <h2 ref={titulo} tabIndex={-1} className="titulo-caso">En esto coinciden</h2>
                <ul className="lista-tregua">{duelo.tregua.coinciden.map((c) => <li key={c}>{c}</li>)}</ul>
              </>
            )}
            {paso === 1 && (
              <>
                <h2 ref={titulo} tabIndex={-1} className="titulo-caso">Aquí está el choque de fondo</h2>
                <p className="historia">{duelo.tregua.choque}</p>
              </>
            )}
            {paso === 2 && (
              <>
                <h2 ref={titulo} tabIndex={-1} className="titulo-caso">Lo que cada una ve y la otra no</h2>
                {(['a', 'b'] as const).map((l) => (
                  <div className="mirada" data-lado={l} key={l}>
                    <h3>{duelo[l].escuela}</h3>
                    <p><b>Ve bien:</b> {duelo.tregua.ve[l]}</p>
                    <p><b>Punto ciego:</b> {duelo.tregua.noVe[l]}</p>
                  </div>
                ))}
                <p className="fuentes">
                  {duelo.tregua.fuentes.map((f, i) => <a key={f} href={f} target="_blank" rel="noopener noreferrer">Fuente {i + 1}</a>)}
                </p>
              </>
            )}
            <button className="boton" onClick={seguir}>{paso < 2 ? 'Seguir' : 'Recoger mi herramienta'}</button>
          </section>
        )}

        {fase === 'fin' && (
          <section className="paso">
            <p className="rotulo">Para tu caja de herramientas</p>
            <h2 ref={titulo} tabIndex={-1} className="titulo-caso">{duelo.herramienta.nombre}</h2>
            <div className="herramienta">
              <div className="herramienta-icono" aria-hidden="true"><Proyectil lado="a" /><Proyectil lado="b" /></div>
              <p>{duelo.herramienta.uso}</p>
            </div>
            <div className="xp" aria-label={`Ganaste ${xp} puntos de experiencia. Acertaste ${aciertos} de ${total}.`}>
              <p className="xp-num" aria-hidden="true">+{xpVisto} <span>XP</span></p>
              <p aria-hidden="true">Acertaste {aciertos} de {total}. {aciertos === total ? 'Juez de lujo.' : aciertos >= total / 2 ? 'Buen ojo.' : 'Las que fallaste son las que más enseñan.'}</p>
            </div>
            <button className="boton" onClick={alSalir}>Volver al inicio</button>
          </section>
        )}
      </div>
    </main>
  );
}
