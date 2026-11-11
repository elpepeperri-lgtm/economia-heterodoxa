import { useEffect, useMemo, useRef, useState } from 'react';
import './duelo.css';
import type { Lado, TDuelo, TPregunta } from '../datos/esquema.ts';
import { cargarDuelo, economista } from '../datos/contenido.ts';
import { colorEscuela, ESCUELAS, nivel, XP_ACIERTO, XP_FINAL } from '../motor/catalogo.ts';
import { registrarDuelo, registrarRespuesta } from '../motor/progreso.ts';
import { Glosario, T, useGlosario } from '../motor/Glosario.tsx';
import { Avance, fraseBien, Pregunta } from '../motor/Pregunta.tsx';
import { Personaje, type Estado } from '../personajes/Personaje.tsx';
import { Escena, Objeto, Proyectil } from '../escenas/Escenas.tsx';
import { Avatar } from './Avatar.tsx';

const BASE = 20;
const LADOS = ['a', 'b'] as const;
const acota = (n: number) => Math.max(0, Math.min(100, n));
const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const otro = (l: Lado): Lado => (l === 'a' ? 'b' : 'a');
const ambos = (e: Estado) => ({ a: e, b: e });
type Estados = { a: Estado; b: Estado };
type Fase = 'entrada' | 'reglas' | 'caso' | 'pregunta' | 'veredicto' | 'tregua' | 'fin';

/** Cualquier duelo del juego: descarga su contenido por id y lo pone en el ring. */
export default function Duelo({ id, alSalir }: { id: string; alSalir: () => void }) {
  const [duelo, setDuelo] = useState<TDuelo | null>(null);
  useEffect(() => { void cargarDuelo(id).then(setDuelo); }, [id]);
  if (!duelo) return <p className="cargando" role="status">Preparando el ring…</p>;
  return <Ring duelo={duelo} alSalir={alSalir} />;
}

function Reglas({ objeto, escuela }: { objeto: TDuelo['casos'][number]['objeto']; escuela: TDuelo['a']['escuelaId'] }) {
  const abrir = useGlosario();
  return (
    <>
      <ol className="reglas">
        <li>
          <span className="regla-icono" aria-hidden="true"><Objeto tipo={objeto} /></span>
          <p><b>Tres casos de la vida real.</b> Cada escuela explica el mismo caso a su manera.</p>
        </li>
        <li>
          <span className="regla-icono" aria-hidden="true"><Proyectil escuela={escuela} /></span>
          <p><b>Tú respondes.</b> Adivina quién diría cada cosa y caza lo que cada uno da por sentado.</p>
        </li>
        <li>
          <span className="regla-icono regla-barra" aria-hidden="true"><i /></span>
          <p><b>La barra no es de vida.</b> Mide qué tan bien explica cada escuela ese caso. No gana nadie: tú te llevas una herramienta.</p>
        </li>
      </ol>
      <p className="nota">
        Las palabras <button type="button" className="termino" onClick={() => abrir('supuesto')}>subrayadas</button> se pueden tocar para ver qué significan.
      </p>
    </>
  );
}

function Ring({ duelo, alSalir }: { duelo: TDuelo; alSalir: () => void }) {
  const [fase, setFase] = useState<Fase>('entrada');
  const [iCaso, setICaso] = useState(0);
  const [iPreg, setIPreg] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [poder, setPoder] = useState({ a: BASE, b: BASE });
  const [est, setEst] = useState<Estados>(ambos('reposo'));
  const [aciertos, setAciertos] = useState(0);
  const [paso, setPaso] = useState(0);
  const [proy, setProy] = useState<Lado>('a');
  const [xpVisto, setXpVisto] = useState(0);
  const [xpTotal, setXpTotal] = useState<number | null>(null);
  const [globo, setGlobo] = useState<{ lado: Lado; texto: string } | null>(null);
  const [marcas, setMarcas] = useState({ a: 0, b: 0 });
  const [pum, setPum] = useState<{ lado: Lado; k: number } | null>(null);
  const [fiesta, setFiesta] = useState(0);

  const arena = useRef<HTMLDivElement>(null);
  const bala = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const devolucion = useRef<HTMLDivElement>(null);
  const relojes = useRef<number[]>([]);

  const caso = duelo.casos[iCaso];
  const preguntas = caso.preguntas.filter((p) => p.estado === 'ok');
  const p: TPregunta = preguntas[iPreg];
  const total = useMemo(() => duelo.casos.reduce((n, c) => n + c.preguntas.filter((q) => q.estado === 'ok').length, 0), [duelo]);
  const xp = aciertos * XP_ACIERTO + XP_FINAL;
  const nombre = { a: duelo.a.nombreCorto, b: duelo.b.nombreCorto };
  const esc = { a: duelo.a.escuelaId, b: duelo.b.escuelaId };
  const nPregunta = iCaso * 3 + iPreg;

  /** `fijo`: el tiempo se respeta aunque el sistema pida reducir movimiento (para poder leer los globos). */
  const luego = (ms: number, f: () => void, fijo = false) => {
    relojes.current.push(window.setTimeout(f, !fijo && sinMovimiento() ? 0 : ms));
  };
  const limpiar = () => { relojes.current.forEach(clearTimeout); relojes.current = []; };
  useEffect(() => limpiar, []);

  // Al cambiar de paso: arriba del panel y foco en el título (teclado y lectores de pantalla).
  useEffect(() => {
    panel.current?.scrollTo(0, 0);
    titulo.current?.focus({ preventScroll: true });
  }, [fase, iCaso, iPreg, paso]);

  useEffect(() => {
    if (fase !== 'fin') return;
    void registrarDuelo(duelo.id, xp, aciertos, duelo.herramienta.nombre).then((pr) => setXpTotal(pr.xp));
    if (sinMovimiento()) { setXpVisto(xp); return; }
    const inicio = performance.now();
    let cuadro = 0;
    const tic = (t: number) => {
      const k = Math.min(1, (t - inicio) / 900);
      setXpVisto(Math.round(xp * (1 - (1 - k) ** 3)));
      if (k < 1) cuadro = requestAnimationFrame(tic);
    };
    cuadro = requestAnimationFrame(tic);
    // Seguro: si el navegador pausa la animación, el número final aparece igual.
    const seguro = window.setTimeout(() => setXpVisto(xp), 1500);
    return () => { cancelAnimationFrame(cuadro); clearTimeout(seguro); };
  }, [fase]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Los personajes hablan por turnos en un globo. */
  function decir(lineas: [Lado, string][], gesticulan = true) {
    lineas.forEach(([l, t], i) => luego(i * 2100, () => {
      setGlobo({ lado: l, texto: t });
      if (gesticulan) setEst({ ...ambos('reposo'), [l]: 'hablar' });
    }, true));
    if (gesticulan) luego(lineas.length * 2100, () => setEst(ambos('reposo')), true);
  }

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
        { transform: `translate(0, -96px) rotate(${d * 320}deg) scale(1.25)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${x1}px, -36px) rotate(${d * 560}deg) scale(1)`, opacity: 1, offset: 0.9 },
        { transform: `translate(${x1}px, -36px) rotate(${d * 580}deg) scale(1.9)`, opacity: 0 },
      ],
      { duration: 680, easing: 'ease-in-out' },
    );
  }

  function temblar() {
    if (sinMovimiento()) return;
    arena.current?.animate(
      [{ transform: 'none' }, { transform: 'translate(-5px, 2px)' }, { transform: 'translate(4px, -2px)' }, { transform: 'translate(-2px, 1px)' }, { transform: 'none' }],
      { duration: 280, easing: 'ease-out' },
    );
  }

  function responder(i: number) {
    if (elegida !== null) return;
    limpiar();
    setElegida(i);
    setGlobo(null);
    const acerto = p.opciones[i].correcta;
    void registrarRespuesta(p.id, acerto);
    if (acerto) { setAciertos((n) => n + 1); setFiesta((k) => k + 1); }
    const ataca = p.ataca;
    const recibe = otro(ataca);
    setEst({ ...ambos('reposo'), [ataca]: 'atacar' });
    luego(180, () => lanzar(ataca));
    luego(760, () => {
      setPoder((v) => ({ a: acota(v.a + p.mueve.a), b: acota(v.b + p.mueve.b) }));
      setMarcas((m) => ({ ...m, [ataca]: m[ataca] + 1 }));
      setPum({ lado: recibe, k: Date.now() });
      setEst({ ...ambos('reposo'), [recibe]: 'golpe' });
      temblar();
    });
    luego(1400, () => {
      setEst({ ...ambos('reposo'), [ataca]: acerto ? 'celebrar' : 'hablar' });
      setGlobo({ lado: ataca, texto: acerto ? fraseBien(nPregunta) : 'Casi. Mira por qué.' });
    });
    luego(1000, () => panel.current?.scrollTo({ top: (devolucion.current?.offsetTop ?? 0) - 12, behavior: sinMovimiento() ? 'auto' : 'smooth' }));
    luego(3200, () => setEst(ambos('reposo')));
  }

  function abrirCaso(i: number) {
    const c = duelo.casos[i];
    setICaso(i); setIPreg(0); setPoder({ a: BASE, b: BASE }); setMarcas({ a: 0, b: 0 }); setFase('caso');
    luego(500, () => decir([['a', c.dicen.a], ['b', c.dicen.b]]), true);
  }

  function seguir() {
    limpiar();
    setElegida(null);
    setGlobo(null);
    setPum(null);
    if (fase === 'entrada') { setFase('reglas'); return; }
    if (fase === 'reglas') { abrirCaso(0); return; }
    if (fase === 'caso') { setFase('pregunta'); setEst(ambos('pensar')); return; }
    if (fase === 'pregunta') {
      if (iPreg + 1 < preguntas.length) { setIPreg(iPreg + 1); setEst(ambos('pensar')); return; }
      setFase('veredicto');
      const gana: Lado = poder.a >= poder.b ? 'a' : 'b';
      if (Math.abs(poder.a - poder.b) <= 10) decir([['a', 'Vamos parejos.'], ['b', 'Por ahora.']]);
      else decir([[gana, 'Este caso es de los míos.'], [otro(gana), 'Ya vendrá el mío.']]);
      return;
    }
    if (fase === 'veredicto') {
      if (iCaso + 1 < duelo.casos.length) { setEst(ambos('reposo')); abrirCaso(iCaso + 1); return; }
      setFase('tregua'); setPaso(0); setEst(ambos('mano'));
      luego(900, () => decir([['a', 'En eso sí estamos de acuerdo.'], ['b', 'Quién lo diría.']], false), true);
      return;
    }
    if (fase === 'tregua') {
      if (paso < 2) setPaso(paso + 1);
      else { setFase('fin'); setEst(ambos('celebrar')); setFiesta((k) => k + 1); }
    }
  }

  const enPelea = fase === 'caso' || fase === 'pregunta' || fase === 'veredicto';
  const niv = xpTotal === null ? null : nivel(xpTotal);

  return (
    <main className="duelo pantalla" data-fase={fase} style={{ ['--a' as string]: colorEscuela(esc.a), ['--b' as string]: colorEscuela(esc.b) }}>
      <Glosario terminos={duelo.glosario} reinicio={`${fase}-${iCaso}-${iPreg}-${paso}`}>
        <div className="arena" ref={arena} data-juntos={fase === 'tregua' || fase === 'fin' || undefined}>
          {LADOS.map((l) => <div className={`esc esc-${l}`} key={l}><Escena escuela={esc[l]} lado={l} /></div>)}

          <button className="salir" onClick={alSalir} aria-label="Salir del duelo">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19" /></svg>
          </button>

          {enPelea && (
            <div className="barras" role="group" aria-label={`Poder explicativo en este caso: ${nombre.a} ${poder.a} de 100, ${nombre.b} ${poder.b} de 100`}>
              {LADOS.map((l) => (
                <div className="barra" data-lado={l} key={l} aria-hidden="true">
                  <span className="barra-nombre">{nombre[l]} <b key={poder[l]}>{poder[l]}</b></span>
                  <span className="barra-pista"><span className="barra-relleno" style={{ transform: `scaleX(${poder[l] / 100})` }} /></span>
                </div>
              ))}
              <span className="barras-pie rotulo" aria-hidden="true">poder explicativo</span>
            </div>
          )}

          {fase === 'entrada' && <div className="sello" aria-hidden="true">vs</div>}

          {LADOS.map((l) => (
            <div className={`lado lado-${l}`} key={l}>
              <Personaje id={duelo[l].economista} mira={l === 'a' ? 'der' : 'izq'} escuela={esc[l]} estado={est[l]} />
            </div>
          ))}

          {enPelea && (
            <div className="objeto" key={caso.id}>
              <Objeto tipo={caso.objeto} />
              {LADOS.map((l) => (
                <div className="marcas" data-lado={l} key={l} aria-hidden="true">
                  {Array.from({ length: marcas[l] }, (_, i) => <span key={i}><Proyectil escuela={esc[l]} /></span>)}
                </div>
              ))}
            </div>
          )}
          <div className="bala" ref={bala}><Proyectil escuela={esc[proy]} /></div>

          {pum && <div className="pum" data-lado={pum.lado} key={pum.k} aria-hidden="true">{ESCUELAS[esc[otro(pum.lado)]].golpe}</div>}
          {fiesta > 0 && (
            <div className="papelitos" key={fiesta} aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ ['--n' as string]: i }} />)}
            </div>
          )}

          <div className="globos" role="status">
            {globo && (
              <p className="globo" data-lado={globo.lado} key={globo.lado + globo.texto}>
                <span className="solo-lector">{nombre[globo.lado]} dice: </span>{globo.texto}
              </p>
            )}
          </div>
        </div>

        <div className="panel" ref={panel}>
          {fase === 'entrada' && (
            <section className="paso">
              <p className="rotulo">Duelo · {duelo.casos.length} asaltos · unos {duelo.minutos} minutos</p>
              <h1 ref={titulo} tabIndex={-1} className="pregunta-grande">{duelo.pregunta}</h1>
              <div className="fichas">
                {LADOS.map((l) => {
                  const e = economista(duelo[l].economista);
                  return (
                    <div className="ficha" data-lado={l} key={l}>
                      <Avatar id={e.id} />
                      <h2>{e.nombre}</h2>
                      <p className="ficha-dato">{e.nace}–{e.muere} · {ESCUELAS[esc[l]].nombre}</p>
                      <p className="ficha-lema">«{duelo[l].lema}»</p>
                    </div>
                  );
                })}
              </div>
              <button className="boton" onClick={seguir}>Ver cómo se juega</button>
            </section>
          )}

          {fase === 'reglas' && (
            <section className="paso">
              <p className="rotulo">Cómo se juega · 20 segundos</p>
              <h2 ref={titulo} tabIndex={-1} className="titulo-caso">Tú eres el juez</h2>
              <Reglas objeto={duelo.casos[0].objeto} escuela={esc.a} />
              <button className="boton" onClick={seguir}>Que empiece</button>
            </section>
          )}

          {fase === 'caso' && (
            <section className="paso" key={caso.id}>
              <p className="rotulo">Asalto {iCaso + 1} de {duelo.casos.length} · {caso.mecanica}</p>
              <h2 ref={titulo} tabIndex={-1} className="titulo-caso">{caso.titulo}</h2>
              <p className="historia"><T>{caso.historia}</T></p>
              <button className="boton" onClick={seguir}>Empezar el asalto</button>
            </section>
          )}

          {fase === 'pregunta' && (
            <section className="paso" key={p.id}>
              <Pregunta
                p={p} elegida={elegida} n={nPregunta} alResponder={responder} alSeguir={seguir}
                tituloRef={titulo} devolucionRef={devolucion}
                avatar={p.avatar ? <Avatar id={p.avatar} credito={false} /> : undefined}
                cabecera={(
                  <div className="cabecera-pregunta">
                    <p className="rotulo">{caso.mecanica}</p>
                    <Avance total={preguntas.length} actual={iPreg} />
                  </div>
                )}
              />
            </section>
          )}

          {fase === 'veredicto' && (
            <section className="paso">
              <p className="rotulo">Así quedó el asalto {iCaso + 1}</p>
              <h2 ref={titulo} tabIndex={-1} className="titulo-caso">
                {poder.a === poder.b ? 'Empate' : Math.abs(poder.a - poder.b) <= 10 ? 'Casi parejo' : `Este caso lo explica mejor ${poder.a > poder.b ? nombre.a : nombre.b}`}
              </h2>
              <p className="marcador">{nombre.a} <b>{poder.a}</b> · {nombre.b} <b>{poder.b}</b></p>
              <p className="historia"><T>{caso.veredicto}</T></p>
              <button className="boton" onClick={seguir}>{iCaso + 1 < duelo.casos.length ? 'Siguiente caso' : 'Tregua'}</button>
            </section>
          )}

          {fase === 'tregua' && (
            <section className="paso" key={paso}>
              <p className="rotulo">Tregua · {paso + 1} de 3</p>
              {paso === 0 && (
                <>
                  <h2 ref={titulo} tabIndex={-1} className="titulo-caso">En esto coinciden</h2>
                  <ul className="lista-tregua">{duelo.tregua.coinciden.map((c) => <li key={c}><span><T>{c}</T></span></li>)}</ul>
                </>
              )}
              {paso === 1 && (
                <>
                  <h2 ref={titulo} tabIndex={-1} className="titulo-caso">Aquí está el choque de fondo</h2>
                  <p className="historia"><T>{duelo.tregua.choque}</T></p>
                </>
              )}
              {paso === 2 && (
                <>
                  <h2 ref={titulo} tabIndex={-1} className="titulo-caso">Lo que cada una ve y la otra no</h2>
                  {LADOS.map((l) => (
                    <div className="mirada" data-lado={l} key={l}>
                      <h3>{ESCUELAS[esc[l]].nombre}</h3>
                      <p><b>Ve bien:</b> <T>{duelo.tregua.ve[l]}</T></p>
                      <p><b>Punto ciego:</b> <T>{duelo.tregua.noVe[l]}</T></p>
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
                <div className="herramienta-icono" aria-hidden="true">{LADOS.map((l) => <Proyectil escuela={esc[l]} key={l} />)}</div>
                <p>{duelo.herramienta.uso}</p>
              </div>
              <div className="xp" aria-label={`Ganaste ${xp} puntos de experiencia. Acertaste ${aciertos} de ${total}.`}>
                <p className="xp-num" aria-hidden="true">+{xpVisto} <span>XP</span></p>
                <p aria-hidden="true">Acertaste {aciertos} de {total}. {aciertos === total ? 'Juez de lujo.' : aciertos >= total / 2 ? 'Buen ojo.' : 'Las que fallaste son las que más enseñan.'}</p>
              </div>
              {niv && (
                <p className="nota">
                  Tu nivel: <b>{niv.nombre}</b>.{niv.siguiente && <> Te faltan {niv.falta} XP para «{niv.siguiente}».</>}
                </p>
              )}
              <button className="boton" onClick={alSalir}>Volver al inicio</button>
            </section>
          )}
        </div>
      </Glosario>
    </main>
  );
}
