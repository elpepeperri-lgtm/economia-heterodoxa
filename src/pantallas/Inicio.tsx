import { useEffect, useState } from 'react';
import './inicio.css';
import { indiceDuelos } from '../datos/contenido.ts';
import { colorEscuela, nivel } from '../motor/catalogo.ts';
import { cargar, type Progreso } from '../motor/progreso.ts';
import { Personaje } from '../personajes/Personaje.tsx';

export function Inicio({ irADuelo, irACreditos }: { irADuelo: (id: string) => void; irACreditos: () => void }) {
  const [prog, setProg] = useState<Progreso | null>(null);
  useEffect(() => { void cargar().then((p) => setProg({ ...p })); }, []);
  const niv = nivel(prog?.xp ?? 0);


  return (
    <main className="inicio pantalla">
      <header className="inicio-cabeza">
        <p className="rotulo">Un juego para pensar la plata, el trabajo y el poder</p>
        <h1>Economía <span>hetero</span><span>doxa</span></h1>
        <p className="inicio-bajada">Ninguna escuela lo explica todo. Cada una es una herramienta: aprende qué ve y qué no ve.</p>
      </header>

      {indiceDuelos.map((d) => {
        const jugado = prog?.duelos[d.id];
        return (
          <section className="cartel" key={d.id} aria-labelledby={`cartel-${d.id}`} style={{ ['--a' as string]: colorEscuela(d.a.escuelaId), ['--b' as string]: colorEscuela(d.b.escuelaId) }}>
            <div className="cartel-ring" aria-hidden="true">
              <div className="cartel-mitad cartel-a"><Personaje id={d.a.economista} mira="der" escuela={d.a.escuelaId} /></div>
              <div className="cartel-mitad cartel-b"><Personaje id={d.b.economista} mira="izq" escuela={d.b.escuelaId} /></div>
              <span className="cartel-vs">vs</span>
            </div>
            <div className="cartel-texto">
              <p className="rotulo">Duelo · {d.minutos} minutos</p>
              <h2 id={`cartel-${d.id}`}>{d.titulo}</h2>
              <p>{d.pregunta} {d.resumen}</p>
              <button className="boton" onClick={() => irADuelo(d.id)}>{jugado ? 'Jugar otra vez' : 'Entrar al duelo'}</button>
              {jugado && <p className="cartel-marca">Tu mejor juicio: {jugado.mejor} de {d.preguntas} aciertos.</p>}
            </div>
          </section>
        );
      })}

      <section className="caja" aria-labelledby="caja-titulo">
        <div className="caja-fila">
          <h2 id="caja-titulo">Tu caja de herramientas</h2>
          <p className="caja-xp">{prog?.xp ?? 0} <span>XP</span></p>
        </div>
        <p className="caja-nivel">Nivel {niv.numero}: <b>{niv.nombre}</b></p>
        {prog && prog.herramientas.length > 0 ? (
          <ul className="caja-lista">{prog.herramientas.map((h) => <li key={h}>{h}</li>)}</ul>
        ) : (
          <p className="caja-vacia">Todavía vacía. Cada duelo te deja una herramienta para entender el mundo.</p>
        )}
      </section>

      <footer className="inicio-pie">
        <button className="enlace" onClick={irACreditos}>Créditos y fuentes</button>
      </footer>
    </main>
  );
}
