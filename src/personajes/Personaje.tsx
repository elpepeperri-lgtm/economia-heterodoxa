import type { ReactElement } from 'react';
import './personajes.css';
import { colorEscuela } from '../motor/catalogo.ts';

export type Estado = 'reposo' | 'hablar' | 'pensar' | 'atacar' | 'golpe' | 'celebrar' | 'mano';
/** Hacia dónde mira: quien va a la izquierda del ring mira a la derecha, y al revés. */
export type Mira = 'der' | 'izq';

/** Marx: barba y melena descomunales; su tic es fruncir el ceño. Mira hacia la derecha. */
function Marx() {
  return (
    <g className="pj-todo">
      <g className="pj-cuerpo">
        <path className="t t-tinta" d="M26 240C24 186 52 156 100 156C148 156 176 186 174 240Z" />
        <path className="t t-acento" d="M100 160L84 240H116Z" />
      </g>
      <g className="pj-cabeza">
        <path className="t t-pelo" d="M100 14C58 8 30 44 38 86C24 112 34 150 58 158H142C166 150 176 112 162 86C170 44 142 8 100 14Z" />
        <path className="t t-papel" d="M68 80C66 52 82 42 100 42C118 42 134 52 132 80V106H68Z" />
        <g className="pj-cejas">
          <path className="t t-ceja" d="M70 69L92 76" />
          <path className="t t-ceja" d="M130 69L108 76" />
        </g>
        <g className="pj-ojos">
          <ellipse cx="82" cy="87" rx="4.5" ry="5.5" />
          <ellipse cx="118" cy="87" rx="4.5" ry="5.5" />
        </g>
        <path className="t t-linea" d="M101 84C109 98 107 104 98 104" />
        <path className="t t-pelo" d="M60 96C50 150 72 198 100 204C128 198 150 150 140 96C128 113 114 111 100 107C86 111 72 113 60 96Z" />
        <path className="t t-fina" d="M78 138C82 162 90 178 100 184M122 138C118 162 110 178 100 184M100 140V170" />
        <ellipse className="pj-boca" cx="100" cy="124" rx="10" ry="3" />
      </g>
      <g className="pj-brazo">
        <path className="t-brazo-borde" d="M156 178C182 188 186 204 172 222" />
        <path className="t t-brazo" d="M156 178C182 188 186 204 172 222" />
        <circle className="t t-papel" cx="172" cy="222" r="11" />
      </g>
    </g>
  );
}

/** Marshall: bigote de morsa y gorrito; su tic es dar tijeretazos. Mira hacia la izquierda. */
function Marshall() {
  return (
    <g className="pj-todo">
      <g className="pj-cuerpo">
        <path className="t t-tinta" d="M34 240C34 192 60 164 100 164C140 164 166 192 166 240Z" />
        <path className="t t-papel" d="M100 166L87 198L100 240L113 198Z" />
        <path className="t t-acento" d="M82 170L100 179L118 170V188L100 179L82 188Z" />
      </g>
      <g className="pj-cabeza">
        <path className="t t-pelo" d="M70 98C50 96 46 66 66 56Z" />
        <path className="t t-pelo" d="M130 98C150 96 154 66 134 56Z" />
        <path className="t t-papel" d="M68 84C66 46 84 30 100 30C116 30 134 46 132 84C132 126 116 152 100 152C84 152 68 126 68 84Z" />
        <path className="t t-tinta" d="M70 56C76 26 124 26 130 56C112 47 88 47 70 56Z" />
        <g className="pj-cejas">
          <path className="t t-ceja" d="M73 76Q83 68 93 75" />
          <path className="t t-ceja" d="M107 75Q117 68 127 76" />
        </g>
        <g className="pj-ojos">
          <ellipse cx="84" cy="89" rx="4" ry="5" />
          <ellipse cx="116" cy="89" rx="4" ry="5" />
        </g>
        <path className="t t-linea" d="M99 86C92 100 94 107 103 107" />
        <ellipse className="pj-boca" cx="100" cy="131" rx="8" ry="2.5" />
        <path className="t t-pelo" d="M100 112C90 103 68 106 58 126C55 140 68 142 78 133C86 127 94 125 100 123C106 125 114 127 122 133C132 142 145 140 142 126C132 106 110 103 100 112Z" />
      </g>
      <g className="pj-brazo">
        <path className="t-brazo-borde" d="M44 184C18 194 14 208 28 224" />
        <path className="t t-brazo" d="M44 184C18 194 14 208 28 224" />
        <g>
          <path className="t-hoja" d="M30 226L6 186" />
          <path className="t-hoja pj-hoja-2" d="M30 226L-6 204" />
          <path className="t t-linea" d="M30 226L6 186" style={{ strokeWidth: 2.5 }} />
        </g>
        <circle className="t t-papel" cx="28" cy="224" r="11" />
      </g>
    </g>
  );
}

/**
 * Registro de caricaturas. Para agregar un personaje: dibujar sus piezas con las clases
 * pj-todo, pj-cuerpo, pj-cabeza, pj-cejas, pj-ojos, pj-boca y pj-brazo (lienzo de 200 × 240),
 * decir hacia dónde mira el dibujo y añadirlo aquí y en CON_CARICATURA (motor/catalogo.ts).
 * Los estados y animaciones salen solos de personajes.css; el tic propio va con data-quien.
 */
const PERSONAJES: Record<string, { Piezas: () => ReactElement; nativo: Mira }> = {
  marx: { Piezas: Marx, nativo: 'der' },
  marshall: { Piezas: Marshall, nativo: 'izq' },
};

export function Personaje({ id, mira, escuela, estado = 'reposo' }: { id: string; mira: Mira; escuela: string; estado?: Estado }) {
  const { Piezas, nativo } = PERSONAJES[id];
  return (
    <svg
      className="pj" data-quien={id} data-nativo={nativo} data-voltear={mira !== nativo || undefined} data-estado={estado}
      style={{ ['--pj-acento' as string]: colorEscuela(escuela) }} viewBox="0 0 200 240" aria-hidden="true" focusable="false"
    >
      <Piezas />
    </svg>
  );
}
