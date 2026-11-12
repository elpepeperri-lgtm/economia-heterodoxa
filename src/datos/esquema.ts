import { z } from 'zod';
import { CON_CARICATURA, ESCUELA_IDS, OBJETOS } from '../motor/catalogo.ts';

const url = z.string().url();
const lado = z.enum(['a', 'b']);

/** Una cita textual exige obra y año. Si no hay cita exacta, se escribe la idea y se marca. */
export const Cita = z.object({
  texto: z.string().min(8),
  tipo: z.enum(['cita', 'idea']),
  autor: z.string(),
  obra: z.string().optional(),
  anio: z.number().int().optional(),
  nota: z.string().optional(),
}).refine((c) => c.tipo === 'idea' || (c.obra && c.anio), { message: 'Una cita textual necesita obra y año' });

export const Opcion = z.object({
  texto: z.string().min(1),
  correcta: z.boolean(),
  /** Por qué es correcta, o por qué tentaba si es errada. */
  porque: z.string().min(20),
});

export const Pregunta = z.object({
  id: z.string(),
  tipo: z.enum(['quien', 'opcion', 'vf', 'supuesto']),
  dificultad: z.number().int().min(1).max(5),
  enunciado: z.string().min(10),
  cita: Cita.optional(),
  opciones: z.array(Opcion).min(2).max(4),
  explicacion: z.string().min(20),
  /** Qué escuela lanza el argumento y cuánto mueve cada barra de poder explicativo. */
  ataca: lado,
  mueve: z.object({ a: z.number(), b: z.number() }),
  avatar: z.string().optional(),
  fuentes: z.array(url).min(1),
  estado: z.enum(['ok', 'verificar']),
}).refine((p) => p.opciones.filter((o) => o.correcta).length === 1, { message: 'Debe haber exactamente una opción correcta' });

export const Caso = z.object({
  id: z.string(),
  objeto: z.enum(OBJETOS),
  titulo: z.string(),
  mecanica: z.string(),
  historia: z.string().max(420),
  /** Lo que dice cada personaje al abrir el caso (globo corto). */
  dicen: z.object({ a: z.string().max(60), b: z.string().max(60) }),
  preguntas: z.array(Pregunta).min(2),
  veredicto: z.string().min(40),
});

export const Luchador = z.object({
  economista: z.enum(CON_CARICATURA),
  escuelaId: z.enum(ESCUELA_IDS),
  nombreCorto: z.string(),
  lema: z.string(),
});

export const Duelo = z.object({
  id: z.string(),
  titulo: z.string(),
  pregunta: z.string(),
  /** Texto corto para el cartel del inicio. */
  resumen: z.string().max(140),
  minutos: z.number().int(),
  a: Luchador,
  b: Luchador,
  casos: z.array(Caso).length(3),
  tregua: z.object({
    coinciden: z.array(z.string()).min(2),
    choque: z.string(),
    ve: z.object({ a: z.string(), b: z.string() }),
    noVe: z.object({ a: z.string(), b: z.string() }),
    fuentes: z.array(url).min(1),
  }),
  herramienta: z.object({ nombre: z.string(), uso: z.string() }),
  /** Palabras que se explican al tocarlas. */
  bibliografia: z.array(z.object({ titulo: z.string(), url })).min(1),
  glosario: z.array(z.object({ termino: z.string(), significado: z.string().max(140) })),
});

export const Economista = z.object({
  id: z.string(),
  nombre: z.string(),
  iniciales: z.string().length(2),
  nace: z.number().int(),
  muere: z.number().int().nullable(),
  escuela: z.enum(ESCUELA_IDS),
  aporte: z.string(),
  wikidata: z.string().optional(),
  foto: z.boolean().optional(),
  fuentes: z.array(url).min(1),
});

export const Credito = z.object({
  autor: z.string(),
  credito: z.string().optional(),
  licencia: z.string(),
  licenciaUrl: z.string().nullable(),
  terminos: z.string().optional(),
  enlace: url,
});

/** Contenido de los modos cortos: «¿Quién es?», «Unir» y «Lecturas cortas». */
export const Modos = z.object({
  quienes: z.array(z.object({
    economista: z.enum(CON_CARICATURA),
    /** De la más difícil a la más fácil. */
    pistas: z.array(z.string().min(20).max(170)).length(3),
    fuentes: z.array(url).min(1),
  })).min(4),
  unir: z.array(z.object({
    id: z.string(),
    titulo: z.string(),
    pares: z.array(z.object({ izq: z.string(), der: z.string() })).min(3).max(6),
    explicacion: z.string().min(20),
    fuentes: z.array(url).min(1),
  })).min(1),
  lecturas: z.array(z.object({
    id: z.string(),
    escuelaId: z.enum(ESCUELA_IDS),
    economista: z.enum(CON_CARICATURA),
    titulo: z.string(),
    /** Una idea por pantalla. */
    pantallas: z.array(z.object({ titulo: z.string(), texto: z.string().min(40).max(330) })).min(2).max(4),
    pregunta: Pregunta,
    fuentes: z.array(url).min(1),
  })).min(1),
});

export type TModos = z.infer<typeof Modos>;
export type TDuelo = z.infer<typeof Duelo>;
export type TCaso = z.infer<typeof Caso>;
export type TPregunta = z.infer<typeof Pregunta>;
export type TEconomista = z.infer<typeof Economista>;
export type TCredito = z.infer<typeof Credito>;
export type Lado = z.infer<typeof lado>;

/** Resumen de cada duelo para el inicio y los créditos. Lo genera scripts/validar.mjs. */
export type TIndiceDuelo = {
  id: string; titulo: string; pregunta: string; resumen: string; minutos: number; preguntas: number;
  a: z.infer<typeof Luchador>; b: z.infer<typeof Luchador>;
  bibliografia: { titulo: string; url: string }[];
};
