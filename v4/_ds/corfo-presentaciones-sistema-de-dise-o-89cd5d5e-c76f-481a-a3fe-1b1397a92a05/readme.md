# Sistema de diseño de presentaciones · Corfo

Sistema de diseño para presentaciones institucionales de **Corfo** (Corporación de Fomento de la Producción, Chile). Cubre el lienzo de 1920 × 1080, la paleta, la tipografía, la familia de layouts de lámina y los primitivos reutilizables con que se arman los decks de la Gerencia de Estrategia.

## Fuentes recibidas

Todo lo que contiene este sistema se derivó del material entregado por el usuario, no de fuentes externas:

- `Sistema de diseño PPT Corfo.zip` (subido al proyecto y expandido en `uploads/`). Contenía:
  - **`Sistema de diseno.dc.html`** — guía de estilo escrita a mano: paleta, degradés, escala tipográfica, seis arquetipos de layout y reglas de uso. Copia en `reference/Sistema de diseno (guia original).dc.html`. **Es la fuente normativa de este sistema.**
  - **`Kickoff Sostenibilidad Financiera.dc.html`** — deck real de 34 láminas (1920 × 1080) construido con esa guía: "Estudio de Sostenibilidad Financiera Institucional y Punto Óptimo Financiero". Copia en `reference/`. **Es la fuente de verdad de los layouts**: cada lámina fue extraída tal cual al grupo "Slides" del tab de Design System.
  - **`logo_corfo2024_azul.png` / `logo_corfo2024_blanco.png`** — logotipo institucional 2024. Copiados a `assets/`.
  - `uploads/20260909 Kickoff_Sostenibilidad_Financiera_Corfo.pdf` — exportación del mismo deck (en `reference/`).
  - `uploads/IMG_04*.jpeg` — fotografías de decks de consultoras (McKinsey) usadas como referencia de densidad y estructura por el autor original. **No son material de marca Corfo y no se incorporaron.**
  - `uploads/*gradient*.jpeg` — imágenes de degradés genéricos de stock. No se incorporaron: el degradé del sistema es CSS.
- No se entregó repositorio de código, archivo Figma ni manual de marca. No hay, por tanto, definiciones de producto digital (app o sitio) en este sistema: **es un sistema de presentaciones**.

## Idioma de corrección: Español (Chile) — obligatorio

Toda salida en PowerPoint (.pptx) debe llevar **cada texto de cada lámina, layout, patrón y nota marcado como `es-CL`** (Español (Chile)). El exportador a PPTX marca el texto como `en-US` por defecto, y PowerPoint subraya entonces en rojo palabras correctas ("avance", "reporta"). El cambio de HTML `lang` no basta: hay que corregir el archivo.

Procedimiento después de cualquier exportación a PPTX:

1. Exportar guardando en el proyecto (`export/<nombre>.pptx`), no como descarga directa.
2. Ejecutar el corrector `tools/pptx-idioma-es-cl.js`:

```js
const src = await (await fetch('https://unpkg.com/jszip@3.10.1/dist/jszip.min.js')).text(); (0, eval)(src);
(0, eval)(await readFile('tools/pptx-idioma-es-cl.js'));
const fixed = await pptxIdiomaEsCL(await readFileBinary('export/deck.pptx'));
await saveFile('export/deck.pptx', fixed);
```

   Reescribe `lang` a `es-CL` en todos los `<a:rPr>`, `<a:endParaRPr>` y `<a:defRPr>` (láminas, layouts, patrones, notas, tema y estilo por defecto de la presentación), elimina `altLang` y fija `<dc:language>es-CL</dc:language>` en las propiedades del documento. El texto nuevo que se escriba en PowerPoint hereda `es-CL`.
3. Entregar el archivo corregido para descarga.

Además, todas las páginas HTML del sistema (plantilla, láminas y fichas) declaran `<html lang="es-CL">`. Cualquier documento nuevo debe hacer lo mismo.

## CONTENT FUNDAMENTALS

Cómo se escribe en estas láminas, con ejemplos del deck fuente.

- **Idioma:** español de Chile (`es-CL`, también como idioma de corrección en PowerPoint; ver sección anterior), registro institucional-técnico. Sin anglicismos salvo los del oficio ("kickoff", "íntegro" cuando es el término legal).
- **Título de lámina afirmativo, no temático.** El título dice la conclusión: *"Corfo necesita un marco técnico para fundamentar las transferencias al Fisco"*, no "Problema". La bajada precisa y matiza: *"La ausencia de un modelo institucional vigente ha expuesto a la Corporación a decisiones sin respaldo metodológico robusto"*.
- **Tercera persona institucional.** Se habla de "Corfo", "la Corporación", "el estudio". Nunca "nosotros" ni "tú/usted". El lector no es interpelado.
- **Casing:** mayúscula solo inicial y en nombres propios. Nunca title case. Las únicas mayúsculas sostenidas son las etiquetas de sección (tracking 0.14em).
- **Frases nominales en listas.** Los ítems no llevan punto final y empiezan por sustantivo: *"Horizonte mínimo de 10 años, extensible al vencimiento de compromisos materiales"*.
- **Énfasis por negrita corta más dos puntos**, no por color: *"**Piso prudencial:** necesidades de liquidez + respaldo patrimonial"*.
- **Cifras y fechas:** número con separador de miles a la chilena ("$ 7.777 mm"), años sin abreviar ("2023", "2024"), fechas largas ("18 de septiembre, 2026"). Los numerales de lista siempre con cero a la izquierda ("01", "02").
- **Notas al pie de lámina** con paréntesis y asterisco: *"(*) Nota: El contrato se encuentra en tramitación por parte del BID…"*.
- **Sin emoji, sin exclamaciones, sin preguntas retóricas, sin metadiscurso** ("en esta lámina veremos…"). El tono es sobrio: expone hechos, compromisos y plazos.
- **Dos divisores de sección disponibles:** el de numeral gigante sobre azul (lámina 03) por defecto, y el divisor plano claro con logo y título en una línea (lámina 22) para presentaciones más corporativas.
- **Los divisores de sección repiten literalmente el texto de la agenda** (título + bajada), para que el auditorio reconozca dónde está.
- **Firma del pie:** "Corfo - Gerencia de Estrategia" (alternativa corta: "Corfo").

## VISUAL FOUNDATIONS

- **Lienzo:** 1920 × 1080 px, 16:9. Márgenes 110 px laterales, 56 px superior (72 en portadas), 44 px inferior. Los paneles a sangre rompen el margen por un solo costado.
- **Dos colores principales:** azul oscuro `#17183B` (base de fondos oscuros, paneles y títulos) y rojo `#D64045` (único acento). El azul `#221E7C` queda para numerales, viñetas y énfasis sobre blanco. Verdes `#0FF4C6` / `#DEFFF2` existen en la paleta institucional pero **no se usan** en presentaciones.
- **Neutros:** `#3F3F3F` texto, `#9197AE` secundario y pies, `#C9CAD5` reglas de 1 px, `#EDF0F5` tarjetas y bandas de nota, `#FFFFFF` lienzo.
- **Tipografía:** **Aptos Display** (700/600) para títulos, numerales y nombres de bloque; **Calibri** (400/600) para bajadas, cuerpo, etiquetas y pies. Consolas solo en documentación, nunca en lámina. Escala: portada 92, sección 88, lámina 56, bloque 46, tarjeta 40, bajada 34/29, cuerpo 27/26, nota 22, pie 12. Tracking negativo en todo lo display (-0.022 a -0.05em), positivo solo en etiquetas (0.14em).
- **Fondos:** un solo degradé en todo el sistema (`--gradient-cover`), reservado a portada y cierre; los divisores usan un degradé lineal muy sutil (`--gradient-divider`); los paneles laterales son `#17183B` plano. Las láminas de contenido son blancas. Máximo dos familias de fondo por deck.
- **Fotografía:** siempre a sangre o en bloque completo, nunca recortada en formas. Tono frío, azulado, sin grano ni filtros. El texto sobre foto va en un panel sólido `#17183B`, no directamente sobre la imagen (sin gradientes de protección).
- **Esquinas rectas en todo.** `--radius: 0`. La única forma redonda del sistema es el retrato circular de 460 px en la lámina de cita.
- **Sin sombras, ni internas ni externas.** La jerarquía se construye con reglas: 1 px `#C9CAD5` entre filas, 3 px `#17183B` sobre columnas, 4 px `#D64045` como acento de título.
- **Tarjetas:** fondo plano `#EDF0F5`, sin borde, sin sombra, sin redondeo. La "tarjeta" de columna no tiene fondo: es solo la regla superior de 3 px.
- **Transparencia y blur:** nada de blur. Transparencia solo en tres usos: bordes de caja sobre oscuro `rgba(255,255,255,.28)`, reglas sobre oscuro `rgba(255,255,255,.22)` y el numeral gigante de divisor al 16 % de blanco.
- **Viñetas y marcas:** cuadrados, no círculos — 12 px en listas, 14 px en la banda de nota, 20 px en hitos de línea de tiempo. El único glifo usado como marca es ▼ rojo entre pasos de diagrama.
- **Diagramas:** cajas con borde 1 px blanco translúcido sobre panel azul, apiladas verticalmente con ▼ rojo; la caja final va en rojo sólido. Las líneas de tiempo son un eje horizontal con hitos cuadrados y tarjetas grises debajo; el hito "hoy" va en rojo.
- **Animación:** ninguna. El sistema es de presentación estática; las transiciones las da el visor de diapositivas.
- **Estados interactivos** (solo para prototipos y web que usen esta paleta): hover oscurece el fondo un paso o cambia el color de texto a `#D64045`; los enlaces son `#221E7C` y `#D64045` en hover; press sin escala ni rebote.
- **Elementos fijos:** logo arriba a la derecha en toda lámina (44 px; 80–96 px en portadas) y pie con regla superior, firma a la izquierda y número de lámina a la derecha. Portadas, cierre y divisores no llevan pie.

## ICONOGRAPHY

- **No hay set de iconos.** Ni en la guía original ni en el deck de 34 láminas aparece un icono, sprite, icon font o SVG decorativo. La señalética es tipográfica y geométrica: numerales ("01"), cuadrados de color, reglas de 1/3/4 px y el triángulo ▼ (carácter Unicode U+25BC en rojo) como conector de diagrama.
- **Emoji: nunca.**
- **Único activo gráfico de marca:** el logotipo Corfo 2024 en dos versiones — `assets/logo-corfo-azul.png` (fondos claros) y `assets/logo-corfo-blanco.png` (fondos oscuros). No existen versiones vectoriales entre los archivos entregados.
- **Banco de imágenes:** 39 fotografías institucionales entregadas por el usuario, en `assets/imagenes/` (`regiones/`, `sectores/`, `personas/`, `institucional/`, `fondos/`), con inventario en `assets/imagenes/_index.json` y cinco fichas en el grupo "Imágenes" del tab. Criterio de uso: **regiones** para divisores y aperturas territoriales (una región por lámina); **sectores** para láminas de instrumento o industria; **personas** para citas y casos; **institucional** para portadas corporativas e hitos históricos; `fondos/fondo-portada.png` es el collage oficial de portada, alternativa a la portada con degradé — el título siempre va sobre panel azul sólido, nunca directamente sobre la foto.
- El deck fuente no traía fotografías: usa marcadores `<image-slot>` (componente web en `assets/image-slot.js`, copiado desde el material original) donde el autor debe arrastrar la foto real. Por eso este sistema no incluye fotografías ni ilustraciones: no se entregó ninguna.
- Si un deck futuro necesitara iconos, la recomendación es un set lineal de trazo uniforme sin relleno (por ejemplo Lucide vía CDN) en `#17183B`, a 2 px de trazo sobre lienzo 1920 — **pendiente de aprobación; no está en uso hoy.**

## Componentes

Primitivos de lámina (`components/core/`):

- **AccentRule** — barra roja de acento de 4 px.
- **Eyebrow** — etiqueta de sección en versalitas espaciadas.
- **CorfoLogo** — logotipo azul o blanco, con alto y ruta de assets.
- **SlideFooter** — pie de lámina con firma y número.
- **BulletItem** — fila de lista con viñeta cuadrada roja y regla.
- **NumberedItem** — fila de agenda: numeral azul, título y bajada.
- **ColumnCard** — columna de argumento con regla superior de 3 px.
- **NoteBanner** — banda gris de cierre con cuadrado rojo.
- **FlowStep** — caja de diagrama sobre panel oscuro (variante roja para el paso final).
- **StatFigure** — cifra destacada con bajada roja y respaldo.

Láminas compuestas (`components/slides/`):

- **SlideCover** — portada con degradé, logo blanco y título al pie.
- **SlideSection** — divisor de sección con numeral gigante.
- **SlideAgenda** — agenda con panel oscuro de 520 px y lista numerada.
- **SlideColumns** — dos o tres argumentos paralelos con banda de nota.
- **SlideContentPanel** — lista de vietas + panel de diagrama de 660 px.
- **SlideQuote** — cita sobre azul oscuro con retrato circular.
- **SlideTimeline** — línea de tiempo horizontal con tarjetas de detalle.
- **SlidePhotoFull** — fotografía a sangre con bloque de texto sólido.

### Adiciones intencionales

El material original es HTML plano: no define componentes. Los 18 anteriores se **derivaron** de patrones que se repiten literalmente en el deck de 34 láminas (cada uno existe al menos tres veces en la fuente); no se inventó ninguna familia nueva. No hay Button, Input ni primitivos de interfaz porque este sistema no describe un producto digital.

## Índice del proyecto

| Ruta | Qué es |
| --- | --- |
| `styles.css` | Punto de entrada; solo `@import`. |
| `tokens/` | `fonts.css` (Aptos Display + Calibri vía local()), `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`. |
| `assets/` | Logotipos Corfo azul y blanco, `image-slot.js`. |
| `assets/imagenes/` | Banco de 39 fotografías institucionales: `regiones/`, `sectores/`, `personas/`, `institucional/`, `fondos/` + `_index.json`. |
| `components/core/`, `components/slides/` | Componentes React + `.d.ts` + `.prompt.md` + tarjeta de vitrina. |
| `guidelines/*.card.html` | 26 fichas de fundamentos (Colors, Type, Spacing, Brand, Imágenes). |
| `guidelines/slides/` | Las 34 láminas del deck fuente, extraídas una por archivo (grupo "Slides"). |
| `templates/deck/Deck.dc.html` | Plantilla de presentación: las 34 láminas del sistema como alternativas, cierre "Gracias" al final, pie configurable. Se elige la lámina adecuada al contenido y se borran las demás. |
| `reference/` | Material original: guía de estilo, deck completo y su PDF. |
| `thumbnail.html` | Tile del sistema. |
| `tools/pptx-idioma-es-cl.js` | Corrector obligatorio post-exportación: marca todo el texto del .pptx como Español (Chile). |
| `SKILL.md` | Envoltorio para usar este sistema como Agent Skill. |

## Caveats

- **Tipografías de Microsoft Office.** Aptos Display y Calibri no son webfonts libres: `tokens/fonts.css` las toma del equipo con `local()`. En PowerPoint y equipos con Office se ven las reales; en otros navegadores Calibri cae en Carlito (Google Fonts, mismas métricas) y Aptos Display en Segoe UI/Helvetica. Si Corfo dispone de archivos con licencia web, se agregan como `@font-face` con `url()` en ese archivo.
- **Logotipo solo en PNG.** Falta la versión vectorial (SVG/EPS) y las versiones monocromas.
- **Sin ilustraciones ni set de iconos:** ver ICONOGRAPHY. El banco de fotografías sí está disponible desde septiembre de 2026.
- **Resoluciones desiguales en el banco.** Sirven a sangre las fotos de `regiones/` (≈1000×1124 o más), `chile.jpg` (7023×4912), `valle-norte.jpg`, `magallanes.jpg`, `los-rios.jpg`, `metropolitana.jpg`, `salar.jpg`, `litio.jpg`, `ctec-construccion.jpg`, `fondo-portada.png` y `persona-07.jpg`. En cambio `nuble.jpg` (404 px), `acuicultura.jpg` (261 px), `electromovilidad.jpg` (517×256), `financiamiento.jpg` (320 px), `naval.jpg` (342 px), el resto de `personas/` (188–331 px) e `institucional/` (262–536 px) solo funcionan en tiles chicos o en el retrato circular de 460 px: a sangre en 1920 × 1080 se amplían 2–4× y se pixelan. Si tienes las versiones grandes de esas, mándalas y reemplazo los archivos.
- **Sin metadatos de crédito ni licencia** en las 39 fotografías: si alguna requiere atribución o tiene uso restringido, indícalo para anotarlo en `_index.json`.
