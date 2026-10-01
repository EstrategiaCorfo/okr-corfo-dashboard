# Dashboard OKR Corfo V2

Sitio estático de seguimiento de la Estrategia Corporativa 2026 a 2030. Incluye Panel general, Estrategia, Resultados Clave, Histórico y una guía para interpretar el seguimiento.

## Versiones independientes

| Versión | Entrada | Datos y criterios |
| --- | --- | --- |
| Panel anterior | `index.html` | Conserva la versión anterior. |
| Propuesta de jefatura | `version-jefatura/Panel general.dc.html` | Conserva la propuesta anterior. |
| V3 | `v3/index.html` | Diseño del 29 de septiembre; un KR de demostración. |
| V4 | `v4/index.html` | Diseño del 1 de octubre. Resultados Clave muestra los 161 KR; Panel general considera los reportados en Seguimiento. Actualmente KR-108 y KR-109, con seis reportes DEMO en Q4 2026. |

La documentación de los JSON y el comando de actualización de v4 están en [v4/README.md](v4/README.md). La descripción siguiente corresponde al panel anterior de la raíz.

## Modelo de datos

El dashboard lee `data/public/strategy.json`, `data/public/tracking.json` y `data/public/objective-notes.json` en GitHub Pages. Se generan desde las hojas **Estrategia** y **Seguimiento** de la planilla maestra y desde el catálogo oficial `data/strategy-catalog.json`, extraído de los anexos A y B de la especificación UX/UI. El catálogo aplica la numeración y los textos oficiales a los JSON sin cambiar los 161 ID de KR de la planilla. El ID KR relaciona ambas hojas. Todas las filas de Seguimiento se conservan; la vista prioriza Confirmado GE y luego la fecha más reciente, con Propuesta Owner como alternativa.

Estado de ejecución, progreso numérico y estatus cualitativo son tres variables independientes. Los hitos sin variables cuantitativas no reciben un progreso estimado.

La gráfica de Estrategia recrea las capas y el orden visual del material institucional. Los colores y el logo provienen del Sistema de diseño PPT Corfo. Las ocho justificaciones están incluidas en los JSON. El ciclo Q3 2026 muestra **Apertura, semana 1, como escenario simulado**, configurado en `assets/okr-config.js`; no representa la semana calendario real.

## Uso y privacidad

Vea [README_ACTUALIZACION.md](README_ACTUALIZACION.md) para validar la planilla, generar los JSON y probar el sitio.

Este repositorio y GitHub Pages son públicos. Los JSON contienen los responsables, suplentes, comentarios, evidencias y pendientes autorizados para la demostración. Se muestran los 161 KR y se puede filtrar por periodo, objetivo y Owner. Los 51 reportes ficticios se identifican como **datos de demostración**. El Excel, el manual y los JSON locales originales permanecen fuera de Git. La planilla actual no contiene la clasificación por tipo de KR ni la marca CDC; el sitio no las deduce.
