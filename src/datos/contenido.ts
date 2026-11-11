import economistasJson from '../../contenido/economistas.json';
import creditosJson from '../../contenido/creditos.json';
import indiceJson from '../../contenido/indice.json';
import type { TCredito, TDuelo, TEconomista, TIndiceDuelo } from './esquema.ts';

export const economistas = economistasJson as TEconomista[];
export const creditos = creditosJson as Record<string, TCredito>;
/** Resumen liviano de cada duelo (el contenido completo se descarga al entrar). */
export const indiceDuelos = indiceJson as TIndiceDuelo[];

export const economista = (id: string) => economistas.find((e) => e.id === id)!;
export const urlFoto = (id: string, lado: 160 | 480) => `${import.meta.env.BASE_URL}fotos/${id}-${lado}.webp`;

const duelos = import.meta.glob<{ default: unknown }>('../../contenido/duelos/*.json');
/** Descarga el contenido de un duelo solo cuando se va a jugar. */
export async function cargarDuelo(id: string): Promise<TDuelo> {
  const m = await duelos[`../../contenido/duelos/${id}.json`]();
  return m.default as TDuelo;
}
