// Progreso guardado solo en el dispositivo: IndexedDB, con respaldo en localStorage.
// Sin cuentas ni servidor. Todo modo de juego registra aquí sus respuestas y su XP.

export type Progreso = {
  xp: number;
  herramientas: string[];
  duelos: Record<string, { veces: number; mejor: number }>;
  /** Historial por pregunta, listo para el repaso espaciado (cajas de Leitner, 1 a 5). */
  preguntas: Record<string, { caja: number; vista: number; fallos: number }>;
};

const CLAVE = 'eh-progreso';
const vacio = (): Progreso => ({ xp: 0, herramientas: [], duelos: {}, preguntas: {} });

function abrir(): Promise<IDBDatabase> {
  return new Promise((ok, mal) => {
    const p = indexedDB.open('economia-heterodoxa', 1);
    p.onupgradeneeded = () => p.result.createObjectStore('kv');
    p.onsuccess = () => ok(p.result);
    p.onerror = () => mal(p.error);
  });
}

async function leer(): Promise<Progreso> {
  try {
    const bd = await abrir();
    const dato = await new Promise<Progreso | undefined>((ok, mal) => {
      const p = bd.transaction('kv').objectStore('kv').get(CLAVE);
      p.onsuccess = () => ok(p.result);
      p.onerror = () => mal(p.error);
    });
    if (dato) return { ...vacio(), ...dato };
  } catch { /* se intenta el respaldo */ }
  try {
    const texto = localStorage.getItem(CLAVE);
    if (texto) return { ...vacio(), ...JSON.parse(texto) };
  } catch { /* sin almacenamiento: se juega igual */ }
  return vacio();
}

async function escribir(p: Progreso): Promise<void> {
  try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch { /* nada */ }
  try {
    const bd = await abrir();
    bd.transaction('kv', 'readwrite').objectStore('kv').put(p, CLAVE);
  } catch { /* queda el respaldo */ }
}

// Los cambios van en fila para que dos guardados seguidos no se pisen.
let fila: Promise<Progreso> = leer();
function cambiar(f: (p: Progreso) => void): Promise<Progreso> {
  fila = fila.then(async (p) => { f(p); await escribir(p); return p; });
  return fila;
}

export const cargar = (): Promise<Progreso> => fila;

/** Leitner: un acierto sube la pregunta de caja; un fallo la devuelve a la primera. */
export function registrarRespuesta(id: string, acerto: boolean) {
  return cambiar((p) => {
    const previa = p.preguntas[id] ?? { caja: 1, vista: 0, fallos: 0 };
    p.preguntas[id] = {
      caja: acerto ? Math.min(5, previa.caja + 1) : 1,
      vista: Date.now(),
      fallos: previa.fallos + (acerto ? 0 : 1),
    };
  });
}

export function registrarDuelo(id: string, xp: number, aciertos: number, herramienta: string) {
  return cambiar((p) => {
    const previo = p.duelos[id] ?? { veces: 0, mejor: 0 };
    p.duelos[id] = { veces: previo.veces + 1, mejor: Math.max(previo.mejor, aciertos) };
    p.xp += xp;
    if (!p.herramientas.includes(herramienta)) p.herramientas.push(herramienta);
  });
}
