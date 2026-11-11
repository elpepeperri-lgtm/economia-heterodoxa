// Progreso guardado solo en el dispositivo: IndexedDB, con respaldo en localStorage.
export type Progreso = {
  xp: number;
  herramientas: string[];
  duelos: Record<string, { veces: number; mejor: number }>;
};

const CLAVE = 'eh-progreso';
const vacio = (): Progreso => ({ xp: 0, herramientas: [], duelos: {} });

function abrir(): Promise<IDBDatabase> {
  return new Promise((ok, mal) => {
    const p = indexedDB.open('economia-heterodoxa', 1);
    p.onupgradeneeded = () => p.result.createObjectStore('kv');
    p.onsuccess = () => ok(p.result);
    p.onerror = () => mal(p.error);
  });
}

export async function cargar(): Promise<Progreso> {
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

export async function guardar(p: Progreso): Promise<void> {
  try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch { /* nada */ }
  try {
    const bd = await abrir();
    bd.transaction('kv', 'readwrite').objectStore('kv').put(p, CLAVE);
  } catch { /* queda el respaldo */ }
}

export async function registrarDuelo(id: string, xp: number, aciertos: number, herramienta: string): Promise<Progreso> {
  const p = await cargar();
  const previo = p.duelos[id] ?? { veces: 0, mejor: 0 };
  p.duelos[id] = { veces: previo.veces + 1, mejor: Math.max(previo.mejor, aciertos) };
  p.xp += xp;
  if (!p.herramientas.includes(herramienta)) p.herramientas.push(herramienta);
  await guardar(p);
  return p;
}
