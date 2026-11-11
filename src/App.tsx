import { lazy, Suspense, useRef, useState } from 'react';
import { Inicio } from './pantallas/Inicio.tsx';

// Cada modo de juego se descarga solo cuando se abre: el primer arranque queda liviano.
const Duelo = lazy(() => import('./pantallas/Duelo.tsx'));
const Creditos = lazy(() => import('./pantallas/Creditos.tsx').then((m) => ({ default: m.Creditos })));

type Pantalla = { ver: 'inicio' } | { ver: 'creditos' } | { ver: 'duelo'; id: string };

export function App() {
  const [pantalla, setPantalla] = useState<Pantalla>({ ver: 'inicio' });
  const [cortina, setCortina] = useState<'fuera' | 'entra' | 'sale'>('fuera');
  const ocupado = useRef(false);

  // Transición «cortina de tinta»: tapa, cambia de pantalla y destapa.
  function ir(a: Pantalla) {
    if (ocupado.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPantalla(a); window.scrollTo(0, 0); return; }
    ocupado.current = true;
    setCortina('entra');
    setTimeout(() => { setPantalla(a); window.scrollTo(0, 0); setCortina('sale'); }, 290);
    setTimeout(() => { setCortina('fuera'); ocupado.current = false; }, 650);
  }

  return (
    <>
      <Suspense fallback={<p style={{ padding: 24 }}>Cargando…</p>}>
        {pantalla.ver === 'inicio' && <Inicio irADuelo={(id) => ir({ ver: 'duelo', id })} irACreditos={() => ir({ ver: 'creditos' })} />}
        {pantalla.ver === 'duelo' && <Duelo id={pantalla.id} alSalir={() => ir({ ver: 'inicio' })} />}
        {pantalla.ver === 'creditos' && <Creditos volver={() => ir({ ver: 'inicio' })} />}
      </Suspense>
      <div className="cortina" data-paso={cortina} aria-hidden="true" />
    </>
  );
}
