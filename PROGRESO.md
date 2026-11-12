# PROGRESO

Bitácora para retomar el proyecto sin releer todo. Lo más reciente va arriba.

## Estado actual

- **Etapa 3, tanda 2 (2026-11-11): duelo «Prebisch contra Ricardo» hecho** (contenido/duelos/comercio.json, 10 preguntas, 3 casos: vino y paño, bultos de café, fábrica de tractores). Escuelas nuevas: estructuralista y clásica, con personajes, escenas (cordillera con fábrica, puerto con velero), objetos (barco, cafe, tractor) y proyectiles. Fotos de Prebisch y Ricardo en dominio público. Jugado completo a 360 px sin errores ni desborde, y el ring visto en captura completa. El orden de los duelos en el inicio ahora lo fija ORDEN_DUELOS (motor/catalogo.ts).
- Fuentes de la tanda 2: Ricardo, Principios cap. 7 (Econlib) y la guía de la biblioteca de la CEPAL sobre Prebisch. cepal.org y repositorio.cepal.org bloquean la consulta automática (403); biblioguias.cepal.org sí abre. No se consiguió el texto de 1949 de Prebisch, así que sus ideas van como «idea, no cita».
- Errores encontrados en el PDF de Andrés: en el duelo 4 las posturas de los asaltos están cruzadas (le atribuye a la CEPAL lo de Ricardo y al revés) y en la lista de fotos Ricardo figura con las fechas de Smith (1723–1790; lo correcto es 1772–1823).
- Siguiente tanda sugerida: Polanyi contra Hayek o Las dos Cambridges. Siguen faltando los tipos unir/ordenar/completar y los modos «¿Quién es?», «Unir» y «Lecturas cortas».

- **Etapa 3, tanda 1 (2026-11-11): duelo «Keynes contra Hayek» hecho** (`contenido/duelos/crisis.json`, 10 preguntas, 3 casos: restaurante vacío, torres a medio hacer, papa y alcaldía). Escuelas nuevas: keynesiana y austriaca, con personajes, escenas (obra pública, café vienés), objetos (plato, obra, papa) y proyectiles. Fotos de Keynes y Hayek con licencia libre. Jugado completo a 360 px sin errores ni desborde; la vista del ring solo se revisó en capturas recortadas.
- **PDF de Andrés** (`investigacion/`, fuera de git; texto en `investigacion/base.txt`): 35 escuelas, 17 duelos, 152 preguntas. Se usa como guion de cada tanda; lo de nivel B o «verificar» se contrasta con fuentes antes de entrar al juego. Buscar en base.txt con grep, no releer el PDF.
- Pendiente de la tanda 1: la carta de Keynes a Hayek sobre «Camino de servidumbre» no se usó porque solo se confirmó en Wikipedia. Los duelos salen en orden alfabético en el inicio (crisis antes que valor). Faltan los tipos unir/ordenar/completar y los modos «¿Quién es?», «Unir» y «Lecturas cortas».
- Siguiente tanda sugerida: Prebisch contra Ricardo (nivel A en el PDF).

- **Estilo nuevo «Cómic de pelea» (2026-11-11):** aplicado a todo el juego a partir de la imagen de referencia de Andrés. Personajes redibujados en SVG con color y sombra (Andrés eligió «dibújalos tú en código»; no hay ilustraciones generadas). Se quitó el tema claro: ahora hay un solo tema. Archivos: `diseno/base.css`, `motor/piezas.css`, `pantallas/duelo.css`, `pantallas/inicio.css`, `personajes/`, `escenas/Escenas.tsx`. Falta que Andrés lo vea en el celular y diga si los personajes le sirven así.

- **Etapa 2 (motor reutilizable): entregada el 2026-11-11, esperando a Andrés para empezar la etapa 3.**
- Etapa 1 (un duelo completo): aprobada y publicada. Etapa 0 (plan): aprobada. Ver PLAN.md.

## Etapa 2: cómo quedó el motor

El juego se ve y se juega igual; lo que cambió es que ya nada está amarrado a Marx y Marshall.

- **Catálogo** (`src/motor/catalogo.ts`): escuelas, objetos del ring, economistas con caricatura, niveles con nombre y valores de XP. El validador lo usa: un duelo que nombre una escuela u objeto que no existe no compila.
- **Personaje** (`src/personajes/Personaje.tsx`): `<Personaje id mira escuela estado>`. Registro `PERSONAJES`; cada dibujo declara hacia dónde mira y el motor lo voltea si hace falta. Los 7 estados salen de `personajes.css`.
- **Escena, Objeto, Proyectil** (`src/escenas/Escenas.tsx`): por id de escuela u objeto.
- **Pregunta** (`src/motor/Pregunta.tsx`): tipos quien, opcion, vf y supuesto, con devolución. No sabe de duelos; sirve para los próximos modos. `Avance` son las rayitas.
- **Glosario** (`src/motor/Glosario.tsx`): `<Glosario terminos>` envuelve una pantalla, `<T>` vuelve tocables las palabras.
- **Estilos**: `diseno/base.css` (tokens, botones, avatar; color por escuela en `--esc-<id>`), `motor/piezas.css` (pregunta y glosario), `pantallas/duelo.css` (ring; usa `--a` y `--b`).
- **Progreso** (`src/motor/progreso.ts`): guardados en fila, historial por pregunta con cajas de Leitner (ya se registra; el repaso es de la etapa 4), duelos, XP y herramientas.
- **Duelo genérico** (`src/pantallas/Duelo.tsx`): recibe un `id` y descarga `contenido/duelos/<id>.json` solo al entrar.
- **Índice** (`contenido/indice.json`): lo genera `scripts/validar.mjs`; el inicio y los créditos se arman con él.

### Receta para agregar un duelo (etapa 3)

1. Escuela nueva: entrada en `ESCUELAS` (catalogo.ts), color `--esc-<id>` en base.css (claro y oscuro), escena y proyectil en Escenas.tsx.
2. Personaje nuevo: piezas SVG en Personaje.tsx, registro `PERSONAJES` y `CON_CARICATURA`. Solo fallecidos.
3. Economistas en `contenido/economistas.json`; correr `npm run fotos`.
4. Objetos nuevos del ring: `OBJETOS` y su dibujo en `Objeto`.
5. Crear `contenido/duelos/<id>.json` siguiendo `valor.json`. `npm run build` valida y actualiza el índice.

### Flojo o pendiente de la etapa 2

- Solo hay un duelo, así que lo genérico se probó con una sola pareja: el volteo de personajes y las escenas al lado contrario no se han visto en la práctica.
- Los tipos de pregunta que faltan (unir, ordenar, completar, arrastrar, intruso) se harán en la etapa 3 junto con los modos que los usan.
- Los textos de los globos del veredicto y la tregua son fijos para todos los duelos.
- Los archivos pasaron a saltos de línea LF (`.gitattributes`).

## Segunda vuelta del duelo (2026-11-11, tras comentarios de Andrés)

Andrés pidió: más animado, menos simple, más fácil de entender, y que sea un sitio web publicado. Hecho en el duelo:

- Globos de diálogo: los personajes hablan por turnos al abrir cada caso, al acertar o fallar, en el veredicto y en la tregua (campo `dicen` del JSON).
- Más movimiento: estallido de golpe (¡TIC!, ¡ZAS!), temblor de la arena, papelitos al acertar, marcas que se acumulan junto al objeto, número de la barra que rebota.
- Pantalla «Cómo se juega» (20 segundos) antes del primer asalto.
- Glosario: las palabras subrayadas se tocan y abren su significado (campo `glosario` del JSON).
- Explicación más corta tras responder; la frase en disputa es un globo que se inclina hacia quien la dijo.
- `jugar.bat`: doble clic para abrir el juego (PowerShell bloquea `npm`; usar `npm.cmd`).

**Publicado (2026-11-11):** https://elpepeperri-lgtm.github.io/economia-heterodoxa/ · código en https://github.com/elpepeperri-lgtm/economia-heterodoxa (público). Cada `git push` a `main` vuelve a publicar solo (`.github/workflows/publicar.yml`). Los commits usan el correo anónimo de GitHub, no el Gmail.

Pendiente de esta vuelta: que Andrés confirme si ahora sí tiene el nivel que quiere antes de la etapa 2. Las capturas automáticas del panel salieron recortadas: lo nuevo se comprobó por medidas y recorrido automático, no a ojo en pantalla completa.

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

## Siguiente: etapa 3 (núcleo)

Unas 12 escuelas núcleo, 6 duelos y los modos «¿Quién es?», «Unir» y «Lecturas cortas». Hacerlo por tandas (un duelo con sus dos escuelas por tanda) y parar entre tandas. Antes, recoger lo que Andrés diga tras probar en el celular.
