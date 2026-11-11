# PROGRESO

Bitácora para retomar el proyecto sin releer todo. Lo más reciente va arriba.

## Estado actual

- **Etapa 1 (un duelo completo): entregada, esperando comentarios de Andrés.** Este duelo define el nivel de calidad del resto.
- Etapa 0 (plan): aprobada. Ver PLAN.md.

## Segunda vuelta del duelo (2026-11-11, tras comentarios de Andrés)

Andrés pidió: más animado, menos simple, más fácil de entender, y que sea un sitio web publicado. Hecho en el duelo:

- Globos de diálogo: los personajes hablan por turnos al abrir cada caso, al acertar o fallar, en el veredicto y en la tregua (campo `dicen` del JSON).
- Más movimiento: estallido de golpe (¡TIC!, ¡ZAS!), temblor de la arena, papelitos al acertar, marcas que se acumulan junto al objeto, número de la barra que rebota.
- Pantalla «Cómo se juega» (20 segundos) antes del primer asalto.
- Glosario: las palabras subrayadas se tocan y abren su significado (campo `glosario` del JSON).
- Explicación más corta tras responder; la frase en disputa es un globo que se inclina hacia quien la dijo.
- `jugar.bat`: doble clic para abrir el juego (PowerShell bloquea `npm`; usar `npm.cmd`).

Pendiente de esta vuelta: **publicar el sitio** (Andrés debe crear cuenta en GitHub) y que Andrés confirme si ahora sí tiene el nivel que quiere antes de la etapa 2. Las capturas automáticas del panel salieron recortadas: lo nuevo se comprobó por medidas y recorrido automático, no a ojo en pantalla completa.

## Cómo probar

- Lo más fácil: doble clic en `jugar.bat`.

- En el computador: `npm run dev` y abrir la dirección «Local» que aparece.
- En el celular (misma red wifi): `npm run dev` y abrir en el celular la dirección «Network». Si Windows pregunta por el firewall, permitir.
- Versión final con modo sin conexión: `npm run build` y luego `npm run preview`.
- El modo sin conexión y «instalar en pantalla de inicio» solo funcionan en `localhost` o con https; en el celular llegarán cuando se publique (etapa 6, o antes si se pide).

## Qué hay en la etapa 1

- Inicio mínimo (`src/pantallas/Inicio.tsx`) con caja de herramientas, XP, tema claro/oscuro y créditos.
- Duelo «Marx contra los neoclásicos» (`src/pantallas/Duelo.tsx`): entrada animada, 3 asaltos sobre 3 casos (tinto, agua y diamante, costurera), 10 preguntas, veredicto por caso, tregua en 3 pasos, herramienta y XP.
- Contenido en `contenido/duelos/valor.json`; esquema Zod en `src/datos/esquema.ts`; `scripts/validar.mjs` corre antes de compilar y genera VERIFICAR.md.
- Personajes SVG por piezas (`src/personajes/`): Marx y Marshall con estados reposo, hablar, pensar, atacar, golpe, celebrar y mano.
- Escenas (fábrica, pizarra), objetos de cada caso y proyectiles en `src/escenas/Escenas.tsx`.
- Fotos: `scripts/fotos.mjs` (se corre una vez con `npm run fotos`). Marx y Marshall en dominio público; Jevons con iniciales. Créditos en `contenido/creditos.json`, informe en INFORME-FOTOS.md.
- Progreso en IndexedDB con respaldo en localStorage (`src/motor/progreso.ts`).
- PWA con service worker (vite-plugin-pwa).

## Comprobado (2026-11-11)

- Compila sin errores y el contenido valida (0 pendientes por verificar).
- Jugado de principio a fin a 360 px de ancho, sin errores en consola y sin desborde horizontal.
- Con el servidor apagado, la app recarga y abre el duelo, con fotos y tipografías (modo sin conexión).
- Peso del primer arranque: unos 79 KB de código comprimido + 94 KB de tipografías = 173 KB. El presupuesto era 150 KB: **se pasa por 23 KB** por las dos tipografías.

## Flojo o pendiente (dicho con franqueza)

- No se probó en un celular real ni se midieron los 60 cuadros por segundo; solo en el navegador del computador a 360 px.
- Tema oscuro y vista de computador: hechos, pero revisados solo por encima.
- Las citas están traducidas del inglés por nosotros (marcado en el juego). Falta decidir si se cotejan con una edición en español.
- Stanford Encyclopedia no se pudo consultar (bloqueada) y la página de hetwebsite.net falló; el contenido se apoya en las obras originales, Econlib y Exploring Economics.
- Sin glosario al tocar palabras, sin sonido ni vibración (son de etapas 2 y 6).
- El brazo de Marx y las tijeras de Marshall son lo menos logrado del dibujo.
- La investigación de referentes (Duolingo, Brilliant) fue breve: se tomó la idea de estados de personaje y reacciones; no se revisó Awwwards.

## Decisiones tomadas

- Herramientas: Vite 8 + React 19 + TypeScript, CSS propio, SVG por piezas, Zod, IndexedDB, PWA.
- Dirección visual: «Imprenta popular». Tipografías: Bricolage Grotesque (títulos) y Literata (lectura), dentro del proyecto.
- Colores de escuela: marxista bermellón, neoclásica azul.
- Duelos sobre tres casos reales; la barra de poder explicativo se reinicia en cada caso y la mueve el contenido, no el acierto del jugador. El XP sí depende de los aciertos (10 por acierto + 20 por terminar).
- El campeón neoclásico es Alfred Marshall (fallecido en 1924), con Jevons como invitado.
- El proyecto sigue dentro de OneDrive (Andrés no pidió moverlo). Si la sincronización molesta, mover a `C:\proyectos\economia-heterodoxa`.
- Git instalado; repositorio local en la rama `main`, sin remoto.

## Siguiente: etapa 2 (motor reutilizable)

Convertir lo validado en piezas reutilizables: personaje genérico, escena, tipos de pregunta, sistema de progreso y sistema de diseño. Incorporar antes los comentarios de Andrés sobre este duelo.
