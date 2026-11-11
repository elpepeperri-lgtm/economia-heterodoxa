// Catálogo del motor: lo que existe en el juego. Sin JSX, para que también lo lea el validador.
// Para agregar una escuela: una entrada aquí, su color en diseno/base.css (--esc-<id>),
// su escena y su proyectil en escenas/Escenas.tsx.

export const ESCUELAS = {
  marxista: { nombre: 'Escuela marxista', golpe: '¡TIC!' },
  neoclasica: { nombre: 'Escuela neoclásica', golpe: '¡ZAS!' },
} as const;
export type EscuelaId = keyof typeof ESCUELAS;
export const ESCUELA_IDS = Object.keys(ESCUELAS) as [EscuelaId, ...EscuelaId[]];

/** Objetos que pueden ir en el centro del ring (dibujados en escenas/Escenas.tsx). */
export const OBJETOS = ['tinto', 'diamante', 'costura'] as const;
export type ObjetoId = (typeof OBJETOS)[number];

/** Economistas con caricatura (dibujados en personajes/Personaje.tsx). Solo personas ya fallecidas. */
export const CON_CARICATURA = ['marx', 'marshall'] as const;

export const colorEscuela = (id: string) => `var(--esc-${id})`;

/** Niveles con nombre propio, según la experiencia acumulada. */
export const NIVELES = [
  { desde: 0, nombre: 'Recién llegado al barrio' },
  { desde: 100, nombre: 'Regateador de ideas' },
  { desde: 300, nombre: 'Juez de barrio' },
  { desde: 700, nombre: 'Ojo de plaza' },
  { desde: 1500, nombre: 'Pluralista de oficio' },
] as const;

export function nivel(xp: number) {
  const i = NIVELES.reduce((ultimo, n, k) => (xp >= n.desde ? k : ultimo), 0);
  const siguiente = NIVELES[i + 1];
  return { numero: i + 1, nombre: NIVELES[i].nombre, falta: siguiente ? siguiente.desde - xp : 0, siguiente: siguiente?.nombre };
}

export const XP_ACIERTO = 10;
export const XP_FINAL = 20;
