import economistasJson from '../../contenido/economistas.json';
import creditosJson from '../../contenido/creditos.json';
import indiceJson from '../../contenido/indice.json';
import { ORDEN_DUELOS } from '../motor/catalogo.ts';
import type { TCredito, TDuelo, TEconomista, TIndiceDuelo } from './esquema.ts';

export const economistas = economistasJson as TEconomista[];
export const creditos = creditosJson as Record<string, TCredito>;
/** Resumen liviano de cada duelo (el contenido completo se descarga al entrar). */
const puesto = (id: string) => { const i = ORDEN_DUELOS.indexOf(id); return i < 0 ? 999 : i; };
export const indiceDuelos = [...(indiceJson as TIndiceDuelo[])].sort((x, y) => puesto(x.id) - puesto(y.id));

export const economista = (id: string) => economistas.find((e) => e.id === id)!;
export const urlFoto = (id: string, lado: 160 | 480) => `${import.meta.env.BASE_URL}fotos/${id}-${lado}.webp`;

const duelos = import.meta.glob<{ default: unknown }>('../../contenido/duelos/*.json');
/** Descarga el contenido de un duelo solo cuando se va a jugar. */
export async function cargarDuelo(id: string): Promise<TDuelo> {
  const m = await duelos[`../../contenido/duelos/${id}.json`]();
  return m.default as TDuelo;
}
