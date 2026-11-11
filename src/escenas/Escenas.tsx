import type { ReactElement } from 'react';
import type { EscuelaId, ObjetoId } from '../motor/catalogo.ts';

// Ambientación de cada escuela, objetos de los casos y proyectiles. Todo decorativo: oculto a lectores de pantalla.
// Para agregar una escuela: su escena en ESCENAS y su proyectil en PROYECTILES (más motor/catalogo.ts).
// Las escenas se dibujan en un lienzo de 200 × 300 sobre el cielo del ring, con el suelo abajo.

function engranaje(dientes: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < dientes * 4; i++) {
    const radio = i % 4 < 2 ? r : r * 0.8;
    const ang = (i / (dientes * 4)) * Math.PI * 2;
    pts.push(`${(Math.cos(ang) * radio).toFixed(1)},${(Math.sin(ang) * radio).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}
const ENGRANAJE = engranaje(10, 34);

function Bandera({ x, y, alto = 120 }: { x: number; y: number; alto?: number }) {
  return (
    <g>
      <path className="esc-asta" d={`M${x} ${y}V${y + alto}`} />
      <path className="esc-bandera" d={`M${x} ${y + 2}C${x + 18} ${y - 6} ${x + 30} ${y + 12} ${x + 52} ${y + 2}V${y + 40}C${x + 30} ${y + 50} ${x + 18} ${y + 32} ${x} ${y + 42}Z`} />
    </g>
  );
}

/** Escuela marxista: fábrica con chimeneas, engranaje y banderas rojas. */
function Fabrica({ ancla }: { ancla: string }) {
  return (
    <svg className="esc-dibujo" viewBox="0 0 200 300" preserveAspectRatio={ancla} aria-hidden="true">
      <g className="esc-humo">
        <circle cx="34" cy="60" r="13" />
        <circle cx="54" cy="40" r="18" />
        <circle cx="82" cy="26" r="12" />
      </g>
      <path className="esc-lejos" d="M96 300V150H140V120H170V150H200V300Z" />
      <path className="esc-muro" d="M0 300V172L30 150V172L60 150V172L90 150V172L120 150V300Z" />
      <path className="esc-muro" d="M20 152V78H42V152ZM68 152V104H84V152Z" />
      <path className="esc-muro-luz" d="M20 78H42V88H20ZM68 104H84V112H68Z" />
      <g className="esc-ventanas">
        <path d="M12 196H30V222H12ZM42 196H60V222H42ZM72 196H90V222H72Z" />
      </g>
      <g transform="translate(150 96)"><path className="esc-engranaje esc-gira" d={ENGRANAJE} /></g>
      <Bandera x={128} y={150} />
      <Bandera x={176} y={176} alto={100} />
    </svg>
  );
}

/** Escuela neoclásica: universidad de columnas con las curvas de oferta y demanda en el frontón. */
function Pizarra({ ancla }: { ancla: string }) {
  return (
    <svg className="esc-dibujo" viewBox="0 0 200 300" preserveAspectRatio={ancla} aria-hidden="true">
      <path className="esc-lejos" d="M0 300V168H40V140H70V168H96V300Z" />
      <path className="esc-piedra" d="M60 132L134 84L208 132Z" />
      <path className="esc-piedra-2" d="M66 132H202V146H66Z" />
      <g className="esc-piedra">
        <path d="M74 146H90V300H74ZM108 146H124V300H108ZM142 146H158V300H142ZM176 146H192V300H176Z" />
      </g>
      <g className="esc-piedra-2">
        <path d="M84 146H90V300H84ZM118 146H124V300H118ZM152 146H158V300H152ZM186 146H192V300H186Z" />
      </g>
      <path className="esc-emblema" d="M118 104C123 116 132 122 146 124M118 124C130 122 140 114 146 104" />
      <circle className="esc-tiza-punto" cx="132" cy="116" r="3" />
    </svg>
  );
}

/** Escuela keynesiana: obra pública, con tanque de agua, tubería y una llave que gotea gasto. */
function Obra({ ancla }: { ancla: string }) {
  return (
    <svg className="esc-dibujo" viewBox="0 0 200 300" preserveAspectRatio={ancla} aria-hidden="true">
      <path className="esc-lejos" d="M104 300V168H150V138H200V300Z" />
      <path className="esc-asta" d="M34 300L46 176M98 300L86 176M38 250H94M42 212H90" />
      <path className="esc-piedra" d="M26 100H106V176H26Z" />
      <path className="esc-agua" d="M29 134H103V173H29Z" />
      <path className="esc-piedra-2" d="M96 100H106V176H96Z" />
      <path className="esc-muro" d="M18 100L66 68L114 100Z" />
      <path className="esc-tubo-borde" d="M106 156H152V206" />
      <path className="esc-tubo" d="M106 156H152V206" />
      <path className="esc-color" d="M140 204H164V216H140Z" />
      <path className="esc-agua esc-gota" d="M152 222C146 231 146 237 152 237C158 237 158 231 152 222Z" />
      <Bandera x={174} y={176} alto={104} />
    </svg>
  );
}

/** Escuela austriaca: café vienés con toldo, taza en el letrero y pizarra de precios en la puerta. */
function Cafe({ ancla }: { ancla: string }) {
  return (
    <svg className="esc-dibujo" viewBox="0 0 200 300" preserveAspectRatio={ancla} aria-hidden="true">
      <path className="esc-lejos" d="M0 300V172H36V146H70V300Z" />
      <g className="esc-humo">
        <circle cx="128" cy="62" r="9" />
        <circle cx="142" cy="46" r="12" />
      </g>
      <path className="esc-piedra" d="M70 300V124H204V300Z" />
      <path className="esc-piedra-2" d="M188 124H204V300H188ZM64 112H208V126H64Z" />
      <path className="esc-piedra" d="M112 84H160L155 112H117Z" />
      <path className="esc-emblema" d="M160 90C172 90 172 104 158 104" />
      <path className="esc-ventanas" d="M86 142H120V176H86ZM146 142H180V176H146Z" />
      <path className="esc-color" d="M78 190H194L206 220H66Z" />
      <path className="esc-muro" d="M124 232H154V300H124ZM84 236H112V280H84Z" />
      <path className="esc-tiza" d="M90 248H106M90 258H101M90 268H106" />
    </svg>
  );
}

const ESCENAS: Record<EscuelaId, (p: { ancla: string }) => ReactElement> = { marxista: Fabrica, neoclasica: Pizarra, keynesiana: Obra, austriaca: Cafe };

/** La escena de una escuela, anclada al lado del ring que le toque. */
export function Escena({ escuela, lado }: { escuela: EscuelaId; lado: 'a' | 'b' }) {
  const Dibujo = ESCENAS[escuela];
  return <Dibujo ancla={lado === 'a' ? 'xMinYMax slice' : 'xMaxYMax slice'} />;
}

/** El público: siluetas al fondo del ring, iguales en todos los duelos. */
export function Publico() {
  const cabezas = Array.from({ length: 13 }, (_, i) => i);
  return (
    <svg className="publico" viewBox="0 0 390 60" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {cabezas.map((i) => (
        <g key={i} transform={`translate(${i * 31 - 6} ${i % 3 === 0 ? 6 : i % 3 === 1 ? 0 : 10})`} className={i % 2 ? 'publico-a' : 'publico-b'}>
          <circle cx="16" cy="16" r="10" />
          <path d="M-2 60C-2 36 6 28 16 28C26 28 34 36 34 60Z" />
        </g>
      ))}
    </svg>
  );
}

export function Objeto({ tipo }: { tipo: ObjetoId }) {
  return (
    <svg className="objeto-dibujo" viewBox="0 0 80 80" aria-hidden="true">
      {tipo === 'tinto' && (
        <g className="ob">
          <path className="ob-vapor" d="M32 22C28 16 36 12 32 5M46 22C42 16 50 12 46 5" />
          <path className="ob-color" d="M20 30H58L54 58C53 63 49 66 44 66H34C29 66 25 63 24 58Z" />
          <path className="ob-lleno" d="M23 32H55L54 40H24Z" />
          <path d="M58 36C70 34 70 52 56 52" />
          <path d="M12 72H66" />
        </g>
      )}
      {tipo === 'diamante' && (
        <g className="ob">
          <path className="ob-papel" d="M8 30H34L31 70H11Z" />
          <path className="ob-agua" d="M10.500 46H32.200L31 70H11Z" />
          <path className="ob-agua" d="M44 30L52 20H68L76 30L60 54Z" />
          <path d="M44 30H76M52 20L56 30L60 54L64 30L68 20" />
        </g>
      )}
      {tipo === 'costura' && (
        <g className="ob">
          <path className="ob-lleno" d="M12 26C12 20 16 18 22 18H58C66 18 68 24 68 30V40H56V32H26V54H12Z" />
          <path d="M62 40V52M6 62H74" />
          <path className="ob-color" d="M6 54H40V62H6Z" />
          <circle className="ob-papel" cx="19" cy="34" r="5" />
        </g>
      )}
      {tipo === 'plato' && (
        <g className="ob">
          <circle className="ob-papel" cx="40" cy="44" r="23" />
          <circle cx="40" cy="44" r="13" />
          <path d="M9 22V68M3 22V34C3 40 15 40 15 34V22" />
          <path d="M72 68V22C63 30 63 42 72 46" />
        </g>
      )}
      {tipo === 'obra' && (
        <g className="ob">
          <path className="ob-color" d="M16 54H58V70H16Z" />
          <path d="M16 70V24H58V70M16 39H58M16 54H58M37 24V70" />
          <path d="M58 24V8H78M70 8V18M6 70H74" />
          <path className="ob-lleno" d="M66 18H74V25H66Z" />
        </g>
      )}
      {tipo === 'papa' && (
        <g className="ob">
          <path className="ob-color" d="M22 28C13 44 13 62 24 71H54C65 62 65 44 56 28Z" />
          <path d="M24 28C32 22 46 22 54 28M27 26L21 15M51 26L57 15M30 44H34M40 56H44" />
          <path className="ob-papel" d="M44 38H74V56H44Z" />
          <path d="M51 47H67" />
        </g>
      )}
    </svg>
  );
}

/** Los golpes son argumentos: reloj de fábrica (marxista), curvas cruzadas (neoclásica), gota de gasto (keynesiana) y etiqueta de precio (austriaca). */
const PROYECTILES: Record<EscuelaId, ReactElement> = {
  marxista: (
    <g className="ob">
      <circle className="ob-color" cx="24" cy="26" r="18" />
      <circle className="ob-papel" cx="24" cy="26" r="12.500" />
      <path d="M24 17V26L30 30M19 4H29M24 4V8" />
    </g>
  ),
  neoclasica: (
    <g className="ob">
      <circle className="ob-color" cx="24" cy="24" r="21" />
      <circle className="ob-papel" cx="24" cy="24" r="15.500" />
      <path d="M14 15C19 25 25 30 34 32M14 32C22 30 28 24 33 15" />
    </g>
  ),
  keynesiana: (
    <g className="ob">
      <circle className="ob-color" cx="24" cy="24" r="21" />
      <path className="ob-agua" d="M24 9C17 20 13 26 13 30A11 11 0 0 0 35 30C35 26 31 20 24 9Z" />
    </g>
  ),
  austriaca: (
    <g className="ob">
      <circle className="ob-color" cx="24" cy="24" r="21" />
      <path className="ob-papel" d="M11 23L23 11H37V25L25 37Z" />
      <circle cx="31.500" cy="16.500" r="2" />
      <path d="M19 24L25 30" />
    </g>
  ),
};

export function Proyectil({ escuela }: { escuela: EscuelaId }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" style={{ ['--ob-color' as string]: `var(--esc-${escuela})` }}>
      {PROYECTILES[escuela]}
    </svg>
  );
}
