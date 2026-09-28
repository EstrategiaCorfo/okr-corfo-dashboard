# Dashboard OKR Corfo V2

Sitio estático de seguimiento de la Estrategia Corporativa 2026 a 2030. Incluye Panel general, Estrategia, Resultados Clave, Histórico y una guía para interpretar el seguimiento.

## Modelo de datos

El dashboard lee `data/public/strategy.json`, `data/public/tracking.json` y `data/public/objective-notes.json` en GitHub Pages. Se generan desde las hojas **Estrategia** y **Seguimiento** de la planilla maestra y desde el catálogo oficial `data/strategy-catalog.json`, extraído de los anexos A y B de la especificación UX/UI. El catálogo aplica la numeración y los textos oficiales a los JSON sin cambiar los 161 ID de KR de la planilla. El ID KR relaciona ambas hojas. Todas las filas de Seguimiento se conservan; la vista prioriza Confirmado GE y luego la fecha más reciente, con Propuesta Owner como alternativa.

Estado de ejecución, progreso numérico y estatus cualitativo son tres variables independientes. Los hitos sin variables cuantitativas no reciben un progreso estimado.

La gráfica de Estrategia recrea las capas y el orden visual del material institucional. Los colores y el logo provienen del Sistema de diseño PPT Corfo. Las ocho justificaciones están incluidas en los JSON. El ciclo Q3 2026 muestra **Apertura, semana 1, como escenario simulado**, configurado en `assets/okr-config.js`; no representa la semana calendario real.

## Uso y privacidad

Vea [README_ACTUALIZACION.md](README_ACTUALIZACION.md) para validar la planilla, generar los JSON y probar el sitio.

Este repositorio y GitHub Pages son públicos. Los JSON contienen los responsables, suplentes, comentarios, evidencias y pendientes autorizados para la demostración. Se muestran los 161 KR y se puede filtrar por periodo, objetivo y Owner. Los 51 reportes ficticios se identifican como **datos de demostración**. El Excel, el manual y los JSON locales originales permanecen fuera de Git. La planilla actual no contiene la clasificación por tipo de KR ni la marca CDC; el sitio no las deduce.
