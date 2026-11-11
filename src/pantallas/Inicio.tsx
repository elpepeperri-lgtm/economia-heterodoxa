import { useEffect, useState } from 'react';
import './inicio.css';
import { cargar, type Progreso } from '../motor/progreso.ts';
import { Personaje } from '../personajes/Personaje.tsx';

export function Inicio({ ir }: { ir: (a: 'duelo' | 'creditos') => void }) {
  const [prog, setProg] = useState<Progreso | null>(null);
  useEffect(() => { void cargar().then(setProg); }, []);
  const jugado = prog?.duelos.valor;

  function cambiarTema() {
    const raiz = document.documentElement;
    const oscuroAhora = raiz.dataset.tema ? raiz.dataset.tema === 'oscuro' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    raiz.dataset.tema = oscuroAhora ? 'claro' : 'oscuro';
    try { localStorage.setItem('eh-tema', raiz.dataset.tema); } catch { /* nada */ }
  }

  return (
    <main className="inicio pantalla">
      <header className="inicio-cabeza">
        <p className="rotulo">Un juego para pensar la plata, el trabajo y el poder</p>
        <h1>Economía <span>hetero</span><span>doxa</span></h1>
        <p className="inicio-bajada">Ninguna escuela lo explica todo. Cada una es una herramienta: aprende qué ve y qué no ve.</p>
      </header>

      <section className="cartel" aria-labelledby="cartel-titulo">
        <div className="cartel-ring" aria-hidden="true">
          <div className="cartel-mitad cartel-a"><Personaje quien="marx" /></div>
          <div className="cartel-mitad cartel-b"><Personaje quien="marshall" /></div>
          <span className="cartel-vs">vs</span>
        </div>
        <div className="cartel-texto">
          <p className="rotulo">Duelo · 4 minutos</p>
          <h2 id="cartel-titulo">Marx contra los neoclásicos</h2>
          <p>¿De dónde sale el valor de las cosas? Tres casos: un tinto, un diamante y un taller de costura.</p>
          <button className="boton" onClick={() => ir('duelo')}>{jugado ? 'Jugar otra vez' : 'Entrar al duelo'}</button>
          {jugado && <p className="cartel-marca">Tu mejor juicio: {jugado.mejor} de 10 aciertos.</p>}
        </div>
      </section>

      <section className="caja" aria-labelledby="caja-titulo">
        <div className="caja-fila">
          <h2 id="caja-titulo">Tu caja de herramientas</h2>
          <p className="caja-xp">{prog?.xp ?? 0} <span>XP</span></p>
        </div>
        {prog && prog.herramientas.length > 0 ? (
          <ul className="caja-lista">{prog.herramientas.map((h) => <li key={h}>{h}</li>)}</ul>
        ) : (
          <p className="caja-vacia">Todavía vacía. Cada duelo te deja una herramienta para entender el mundo.</p>
        )}
      </section>

      <footer className="inicio-pie">
        <button className="enlace" onClick={() => ir('creditos')}>Créditos y fuentes</button>
        <button className="enlace" onClick={cambiarTema}>Cambiar a claro u oscuro</button>
      </footer>
    </main>
  );
}
