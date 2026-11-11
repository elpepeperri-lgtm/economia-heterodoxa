import type { ReactElement } from 'react';
import './personajes.css';
import { colorEscuela } from '../motor/catalogo.ts';

export type Estado = 'reposo' | 'hablar' | 'pensar' | 'atacar' | 'golpe' | 'celebrar' | 'mano';
/** Hacia dónde mira: quien va a la izquierda del ring mira a la derecha, y al revés. */
export type Mira = 'der' | 'izq';

function Ojo({ x, y, mira }: { x: number; y: number; mira: number }) {
  return (
    <>
      <ellipse className="t f-blanco" cx={x} cy={y} rx="8" ry="6" style={{ strokeWidth: 2.6 }} />
      <circle className="pupila" cx={x + mira} cy={y + 0.5} r="3.4" />
    </>
  );
}

/** Marx: melena y barba descomunales, ceño de trueno; su tic es fruncir el ceño. Mira hacia la derecha. */
function Marx() {
  return (
    <g className="pj-todo">
      <g className="pj-cuerpo">
        <path className="t f-traje" d="M16 280C14 214 48 178 120 174C192 178 226 214 224 280Z" />
        <path className="f-traje-2" d="M30 276C30 226 52 198 92 186C62 204 48 232 46 276Z" />
        <path className="t f-blanco" d="M120 178L94 198L110 280H130L146 198Z" />
        <path className="t f-traje-2" d="M94 198L68 214L102 262L112 226Z" />
        <path className="t f-traje-2" d="M146 198L172 214L138 262L128 226Z" />
        <path className="t f-acento" d="M120 200L110 214L120 268L130 214Z" />
        <circle className="t f-tinta" cx="92" cy="258" r="2.4" />
      </g>
      <g className="pj-cabeza">
        <path className="t f-pelo" d="M120 14C76 2 38 32 44 78C22 96 26 142 52 158C46 180 68 198 92 190H148C172 198 194 180 188 158C214 142 218 96 196 78C202 32 164 2 120 14Z" />
        <path className="f-pelo-2" d="M196 78C218 96 214 142 188 158C194 180 172 198 148 190C170 176 182 150 180 120C192 106 196 92 196 78Z" />
        <path className="fina" d="M62 60C70 44 84 36 98 34M54 104C50 120 54 138 64 148M150 32C164 36 174 46 180 60" />
        <path className="t f-piel" d="M82 94C80 60 96 46 120 46C144 46 160 60 158 94V126H82Z" />
        <path className="f-piel-2" d="M146 54C158 64 160 80 158 126H146C151 98 152 76 146 54Z" />
        <g className="pj-cejas">
          <path className="t ceja" d="M84 84L111 93" />
          <path className="t ceja" d="M156 84L129 93" />
        </g>
        <g className="pj-ojos">
          <Ojo x={99} y={102} mira={2} />
          <Ojo x={141} y={102} mira={2} />
        </g>
        <path className="t linea" d="M121 98C130 112 129 121 118 122" />
        <path className="t f-pelo" d="M70 110C58 172 86 228 120 236C154 228 182 172 170 110C156 130 138 128 120 124C102 128 84 130 70 110Z" />
        <path className="f-pelo-2" d="M170 112C180 172 154 226 120 234C146 214 162 176 162 132C166 126 169 120 170 112Z" />
        <path className="fina" d="M92 156C96 184 106 204 120 212M146 156C143 180 134 200 120 212M120 162V196" />
        <path className="t f-bigote" d="M90 126C103 115 116 119 120 126C124 119 137 115 150 126C142 141 129 137 120 132C111 137 98 141 90 126Z" />
        <ellipse className="pj-boca" cx="120" cy="145" rx="10" ry="3" />
      </g>
      <g className="pj-brazo">
        <path className="manga-borde" d="M186 206C216 218 220 242 202 262" />
        <path className="manga" d="M186 206C216 218 220 242 202 262" />
        <path className="manga-luz" d="M196 210C212 220 216 234 210 246" />
        <path className="t f-blanco" d="M190 252L210 268L202 278L182 262Z" />
        <path className="t f-piel" d="M184 262C176 266 174 280 184 286C196 292 210 284 208 272L226 268C232 266 230 258 224 259L204 262Z" />
        <path className="t linea" d="M190 270C194 274 200 274 203 270" style={{ strokeWidth: 2.4 }} />
      </g>
    </g>
  );
}

/** Marshall: bigote de morsa, gorrito y tijeras; su tic es dar tijeretazos. Mira hacia la izquierda. */
function Marshall() {
  return (
    <g className="pj-todo">
      <g className="pj-cuerpo">
        <path className="t f-traje" d="M22 280C22 218 56 184 120 180C184 184 218 218 218 280Z" />
        <path className="f-traje-2" d="M210 276C210 228 188 202 150 190C178 208 192 234 194 276Z" />
        <path className="t f-blanco" d="M120 184L98 204L112 280H128L142 204Z" />
        <path className="t f-traje-2" d="M98 204L74 218L104 264L113 230Z" />
        <path className="t f-traje-2" d="M142 204L166 218L136 264L127 230Z" />
        <path className="t f-acento" d="M96 196L120 207L144 196V220L120 209L96 220Z" />
        <circle className="t f-acento" cx="120" cy="208" r="5" />
      </g>
      <g className="pj-cabeza">
        <path className="t f-pelo" d="M92 118C62 118 56 76 84 62Z" />
        <path className="t f-pelo" d="M148 118C178 118 184 76 156 62Z" />
        <path className="t f-piel" d="M86 98C84 54 100 38 120 38C140 38 156 54 154 98C154 146 140 174 120 174C100 174 86 146 86 98Z" />
        <path className="f-piel-2" d="M142 46C154 58 155 78 154 98C154 140 142 168 124 173C138 150 144 120 144 96C144 76 146 60 142 46Z" />
        <path className="t f-traje" d="M86 68C90 26 150 26 154 68C134 57 106 57 86 68Z" />
        <path className="f-traje-2" d="M96 50C102 38 116 34 128 36C114 40 104 46 98 56Z" />
        <g className="pj-cejas">
          <path className="t ceja" d="M90 88Q101 79 113 87" style={{ stroke: '#6d6885' }} />
          <path className="t ceja" d="M127 87Q139 79 150 88" style={{ stroke: '#6d6885' }} />
        </g>
        <g className="pj-ojos">
          <Ojo x={102} y={102} mira={-2} />
          <Ojo x={138} y={102} mira={-2} />
        </g>
        <path className="t linea" d="M119 98C111 113 113 122 124 122" />
        <ellipse className="pj-boca" cx="120" cy="150" rx="8" ry="2.6" />
        <path className="t f-pelo" d="M120 128C108 117 82 121 72 144C68 161 84 164 96 153C106 146 114 142 120 140C126 142 134 146 144 153C156 164 172 161 168 144C158 121 132 117 120 128Z" />
        <path className="fina" d="M92 136C88 142 84 148 82 154M148 136C152 142 156 148 158 154M120 128V139" />
      </g>
      <g className="pj-brazo">
        <path className="manga-borde" d="M54 210C24 222 20 246 38 264" />
        <path className="manga" d="M54 210C24 222 20 246 38 264" />
        <path className="manga-luz" d="M44 214C28 224 24 238 30 250" />
        <path className="t f-acero" d="M40 268L8 214L20 210Z" />
        <path className="t f-acero pj-hoja-2" d="M40 268L-4 238L4 228Z" />
        <circle className="t linea" cx="54" cy="282" r="7" style={{ stroke: 'var(--pj-acento)', strokeWidth: 4 }} />
        <path className="t f-blanco" d="M50 254L30 270L38 280L58 264Z" />
        <circle className="t f-piel" cx="42" cy="270" r="12" />
      </g>
    </g>
  );
}

const PELO_OSCURO = { fill: '#3d3140' };

/** Keynes: cara larga, pelo oscuro peinado, bigote espeso y párpados caídos; su tic es levantar las cejas. Mira hacia la derecha. */
function Keynes() {
  return (
    <g className="pj-todo">
      <g className="pj-cuerpo">
        <path className="t f-traje" d="M18 280C16 216 52 182 120 178C188 182 224 216 222 280Z" />
        <path className="f-traje-2" d="M32 276C32 228 54 202 92 190C64 208 50 234 48 276Z" />
        <path className="t f-blanco" d="M120 182L96 202L111 280H129L144 202Z" />
        <path className="t f-traje-2" d="M96 202L70 216L103 264L112 228Z" />
        <path className="t f-traje-2" d="M144 202L170 216L137 264L128 228Z" />
        <path className="t f-acento" d="M112 200H128L125 214L132 262L120 274L108 262L115 214Z" />
      </g>
      <g className="pj-cabeza">
        <circle className="t f-piel" cx="83" cy="106" r="9" />
        <circle className="t f-piel-2" cx="157" cy="106" r="9" />
        <path className="t f-piel" d="M84 92C82 54 98 38 120 38C142 38 158 54 156 92C156 142 142 174 120 174C98 174 84 142 84 92Z" />
        <path className="f-piel-2" d="M144 48C155 60 157 78 156 94C156 140 143 168 125 173C139 150 146 120 146 96C146 76 148 62 144 48Z" />
        <path className="t f-pelo" style={PELO_OSCURO} d="M83 80C78 42 98 26 124 28C150 30 163 50 157 82C151 64 140 55 126 53C110 51 95 58 83 80Z" />
        <path className="fina" style={{ stroke: '#6b5a6e' }} d="M98 44C108 37 122 35 134 38M140 44C147 49 151 56 152 64" />
        <g className="pj-cejas">
          <path className="t ceja" style={{ stroke: '#3d3140' }} d="M89 90Q101 82 113 89" />
          <path className="t ceja" style={{ stroke: '#3d3140' }} d="M127 89Q139 82 151 90" />
        </g>
        <g className="pj-ojos">
          <Ojo x={102} y={104} mira={2} />
          <Ojo x={140} y={104} mira={2} />
          <path className="t f-piel" style={{ strokeWidth: 2.6 }} d="M93 103C96 95 108 95 111 103ZM131 103C134 95 146 95 149 103Z" />
        </g>
        <path className="t linea" d="M121 102C130 117 129 125 118 126" />
        <ellipse className="pj-boca" cx="120" cy="151" rx="9" ry="2.8" />
        <path className="t f-pelo" style={PELO_OSCURO} d="M94 136C103 126 115 128 120 133C125 128 137 126 146 136C141 147 129 145 120 140C111 145 99 147 94 136Z" />
      </g>
      <g className="pj-brazo">
        <path className="manga-borde" d="M186 206C216 218 220 242 202 262" />
        <path className="manga" d="M186 206C216 218 220 242 202 262" />
        <path className="manga-luz" d="M196 210C212 220 216 234 210 246" />
        <path className="t f-blanco" d="M190 252L210 268L202 278L182 262Z" />
        <path className="t f-piel" d="M184 262C176 266 174 280 184 286C196 292 210 284 208 272L226 268C232 266 230 258 224 259L204 262Z" />
        <path className="t linea" d="M190 270C194 274 200 274 203 270" style={{ strokeWidth: 2.4 }} />
      </g>
    </g>
  );
}

/** Hayek: gafas redondas, pelo blanco a los lados y bigote corto; su tic es mecer la etiqueta de precio. Mira hacia la izquierda. */
function Hayek() {
  return (
    <g className="pj-todo">
      <g className="pj-cuerpo">
        <path className="t f-traje" d="M22 280C22 218 56 184 120 180C184 184 218 218 218 280Z" />
        <path className="f-traje-2" d="M210 276C210 228 188 202 150 190C178 208 192 234 194 276Z" />
        <path className="t f-blanco" d="M120 184L98 204L112 280H128L142 204Z" />
        <path className="t f-traje-2" d="M98 204L74 218L104 264L113 230Z" />
        <path className="t f-traje-2" d="M142 204L166 218L136 264L127 230Z" />
        <path className="t f-acento" d="M112 202H128L125 216L131 262L120 274L109 262L115 216Z" />
      </g>
      <g className="pj-cabeza">
        <path className="t f-pelo" d="M92 122C60 120 56 74 86 58Z" />
        <path className="t f-pelo" d="M148 122C180 120 184 74 154 58Z" />
        <path className="t f-piel" d="M86 98C84 54 100 38 120 38C140 38 156 54 154 98C154 146 140 174 120 174C100 174 86 146 86 98Z" />
        <path className="f-piel-2" d="M142 46C154 58 155 78 154 98C154 140 142 168 124 173C138 150 144 120 144 96C144 76 146 60 142 46Z" />
        <path className="t f-pelo" d="M87 70C88 36 152 36 153 70C138 54 102 54 87 70Z" />
        <path className="fina" d="M100 50C108 45 118 43 128 44" />
        <g className="pj-cejas">
          <path className="t ceja" d="M88 84Q100 77 112 83" style={{ stroke: '#8f8ba6' }} />
          <path className="t ceja" d="M128 83Q140 77 152 84" style={{ stroke: '#8f8ba6' }} />
        </g>
        <g className="pj-ojos">
          <Ojo x={101} y={103} mira={-2} />
          <Ojo x={139} y={103} mira={-2} />
        </g>
        <path className="t linea" style={{ strokeWidth: 3.2 }} d="M116 103A15 15 0 1 1 86 103A15 15 0 1 1 116 103ZM154 103A15 15 0 1 1 124 103A15 15 0 1 1 154 103ZM116 101Q120 97 124 101" />
        <path className="t linea" d="M119 110C113 120 114 126 124 126" />
        <ellipse className="pj-boca" cx="120" cy="152" rx="8" ry="2.6" />
        <path className="t f-pelo" d="M98 137C106 129 116 131 120 135C124 131 134 129 142 137C138 146 127 144 120 140C113 144 102 146 98 137Z" />
      </g>
      <g className="pj-brazo">
        <path className="manga-borde" d="M54 210C24 222 20 246 38 264" />
        <path className="manga" d="M54 210C24 222 20 246 38 264" />
        <path className="manga-luz" d="M44 214C28 224 24 238 30 250" />
        <g className="pj-etiqueta">
          <path className="t f-blanco" d="M38 262L-2 246L-6 222L10 208L48 228Z" />
          <circle className="t f-acento" cx="6" cy="226" r="4" style={{ strokeWidth: 2.4 }} />
          <path className="t linea" style={{ strokeWidth: 3, stroke: 'var(--pj-acento)' }} d="M18 232L36 242M14 242L28 250" />
        </g>
        <path className="t f-blanco" d="M50 254L30 270L38 280L58 264Z" />
        <circle className="t f-piel" cx="42" cy="270" r="12" />
      </g>
    </g>
  );
}

/**
 * Registro de caricaturas. Para agregar un personaje: dibujar sus piezas con las clases
 * pj-todo, pj-cuerpo, pj-cabeza, pj-cejas, pj-ojos, pj-boca y pj-brazo (lienzo de 240 × 280),
 * decir hacia dónde mira el dibujo y añadirlo aquí y en CON_CARICATURA (motor/catalogo.ts).
 * Los estados y animaciones salen solos de personajes.css; el tic propio va con data-quien.
 */
const PERSONAJES: Record<string, { Piezas: () => ReactElement; nativo: Mira }> = {
  marx: { Piezas: Marx, nativo: 'der' },
  marshall: { Piezas: Marshall, nativo: 'izq' },
  keynes: { Piezas: Keynes, nativo: 'der' },
  hayek: { Piezas: Hayek, nativo: 'izq' },
};

export function Personaje({ id, mira, escuela, estado = 'reposo' }: { id: string; mira: Mira; escuela: string; estado?: Estado }) {
  const { Piezas, nativo } = PERSONAJES[id];
  return (
    <svg
      className="pj" data-quien={id} data-nativo={nativo} data-voltear={mira !== nativo || undefined} data-estado={estado}
      style={{ ['--pj-acento' as string]: colorEscuela(escuela) }} viewBox="0 0 240 280" aria-hidden="true" focusable="false"
    >
      <Piezas />
    </svg>
  );
}
