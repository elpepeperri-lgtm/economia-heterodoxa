import economistasJson from '../../contenido/economistas.json';
import creditosJson from '../../contenido/creditos.json';
import type { TCredito, TEconomista } from './esquema.ts';

export const economistas = economistasJson as TEconomista[];
export const creditos = creditosJson as Record<string, TCredito>;

export const economista = (id: string) => economistas.find((e) => e.id === id)!;

/** Color de acento de cada escuela (una sola tinta por escuela). */
export const acento: Record<string, string> = {
  marxista: 'var(--marx)',
  neoclasica: 'var(--neo)',
};

export const urlFoto = (id: string, lado: 160 | 480) => `${import.meta.env.BASE_URL}fotos/${id}-${lado}.webp`;
