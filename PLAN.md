# PLAN — Economía Heterodoxa

Juego web (primero celular) para aprender la historia del pensamiento económico desde todas sus escuelas. Pluralista: nadie gana la verdad; el jugador arma su caja de herramientas.

## Herramientas (y por qué, en una línea)

- **Vite + React + TypeScript**: rápido, estándar, y los errores se atrapan antes de que lleguen al juego.
- **CSS propio con variables** (sin Tailwind ni librerías de componentes): identidad propia y poco peso.
- **Personajes en SVG por piezas**, movidos con CSS + Web Animations API: 60 cuadros por segundo sin librerías pesadas.
- **Contenido en JSON por escuela, validado con Zod al compilar**: si falta una fuente, no compila.
- **Progreso en IndexedDB con respaldo en localStorage**: todo queda en el dispositivo, sin cuentas ni rastreo.
- **PWA (vite-plugin-pwa)**: funciona sin internet y se instala en la pantalla de inicio.
- **Tipografías dentro del proyecto** (no desde Google): necesario para que funcione offline.
- **Publicación (etapa 6)**: Cloudflare Pages o GitHub Pages, ambas gratuitas.

## Carpetas

```
contenido/            escuelas/*.json · duelos/*.json · economistas.json · creditos.json
scripts/              fotos.mjs (se corre una vez) · validar.mjs
public/               fotos/ (WebP 160 y 480) · fuentes/ · iconos PWA
src/
  diseno/             variables, tipografía, temas claro/oscuro
  motor/              personaje, escena, preguntas, progreso (etapa 2)
  personajes/         un SVG por piezas por economista
  escenas/            ambientación por escuela
  pantallas/          inicio, duelo, resultado, créditos...
  datos/              esquemas Zod y carga de contenido
PLAN.md · PROGRESO.md · VERIFICAR.md
```

## Esquema de datos (resumen)

- **Escuela**: id, nombre, familia, época, contexto, color, economistas[], ideas[3–5] (texto + analogía), seOponeA[], coincideCon[], veBien, puntoCiego, preguntaEstrella, fuentes[].
- **Economista**: id, nombre, años, escuela, aporte, foto (o iniciales), vivo (sí/no: decide si puede tener caricatura).
- **Pregunta**: id, escuela, tipo, dificultad 1–5, enunciado, opciones, correcta, explicación, porQuéTienta (por opción errada), glosario[], fuentes[], estado («ok» | «verificar»).
- **Duelo**: id, preguntaDelMundo, ladoA, ladoB, casos[3] (cada uno con su asalto y cuánto «poder explicativo» mueve), tregua {coinciden, choque, loQueVeCadaUna}, herramienta.
- **Cita**: texto, obra, año, fuente — o marcada «idea, no cita».
- **Conexión** (mapa): desde, hasta, tipo (hereda de | discute con | coincide en), historia, duelo.

Regla dura: lo que esté en «verificar» no entra al juego y se lista en VERIFICAR.md.

## Mi propuesta para los duelos (mejor que la base)

**El duelo se pelea sobre tres casos reales, no en abstracto.** En «¿de dónde sale el valor?»: (1) el tinto de la esquina, (2) el agua y el diamante, (3) el salario de la costurera. El objeto del caso está en el centro del ring y los argumentos lo transforman físicamente (el reloj de fábrica de Marx lo «llena» de horas de trabajo; las curvas del neoclásico lo cruzan en un precio).
La barra de **poder explicativo se reinicia en cada caso**: una escuela brilla en uno y cojea en otro. Así el pluralismo no se predica: se ve en la mecánica.
El jugador no es espectador sino **el juez de barrio**: adivina quién diría cada argumento, elige el contraataque y caza el supuesto escondido. Los personajes le hablan a él, reaccionan a su decisión, y al fallar explican con cariño por qué la opción tentaba.
Final: tregua, apretón de manos, y la herramienta ganada cae en la caja.

## Dirección visual

- **A. Imprenta popular (elegida)**: cartel de imprenta y grabado latinoamericano. Papel crema, tinta casi negra, un solo color de acento por escuela en tinta plana, trazo grueso irregular, textura de papel. Títulos condensados de cartel + una serif cómoda para leer.
- **B. Cuaderno de tiza**: pizarra oscura, trazo de tiza, diagramas dibujados a mano. Bonita, pero cansa en lecturas largas y se parece a otras apps educativas.

Elijo A: tiene raíz latinoamericana, no se parece a nada del género y el trazo de grabado da carácter a las caricaturas. Tema oscuro = «tinta de noche» (mismo sistema invertido).

## Presupuesto de peso

Primer arranque ≤ 150 KB comprimidos (sin fotos). Cada duelo ≤ 80 KB adicionales, cargado solo al entrar. Fotos ≤ 25 KB (480 px).

## Etapas (paro y espero al final de cada una)

0. **Plan** — este archivo. ← aquí estamos
1. **Un duelo completo**: inicio mínimo + «Marx contra los neoclásicos», 2 personajes animados, 8–10 preguntas con fuente, 1 foto con crédito, offline.
2. **Motor reutilizable**: personaje, escena, tipos de pregunta, progreso, sistema de diseño.
3. **Núcleo**: ~12 escuelas, 6 duelos, «¿Quién es?», «Unir», «Lecturas cortas».
4. **Profundidad**: mapa de conexiones, repaso espaciado (Leitner), insignias, laboratorios, modo principiante.
5. **Expansión**: resto del mapa en tandas de 5–6 escuelas.
6. **Pulido**: accesibilidad, rendimiento, sonido opcional, publicación.

## Decisiones anotadas

- Node 24 y npm 11 ya están instalados. **Falta git** (ver PROGRESO.md).
- La carpeta está dentro de OneDrive: la carpeta `node_modules` (miles de archivos) puede volver lenta la sincronización. Recomiendo mover el proyecto a `C:\proyectos\economia-heterodoxa` antes de la etapa 1.
- La investigación de Duolingo, Brilliant y Awwwards, y la del contenido de Marx y los neoclásicos, se hace al empezar la etapa 1 (para no gastar uso antes de tu «ok»).
