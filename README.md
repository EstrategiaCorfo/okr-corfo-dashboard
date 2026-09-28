# Dashboard OKR Corfo V2

Sitio estático de seguimiento de la Estrategia Corporativa 2026-2030. Incluye panel general, Key Results, detalle de KR, histórico y esquema interactivo de Estrategia.

## Modelo de datos

El dashboard lee `data/strategy.json` y `data/tracking.json`, generados desde las hojas **Estrategia** y **Seguimiento** de la planilla maestra. El ID KR relaciona ambas hojas. Todas las filas de Seguimiento se conservan; la vista actual prioriza Confirmado GE y luego la fecha más reciente, con Propuesta Owner como alternativa.

Estado de ejecución, progreso numérico y estatus cualitativo son tres variables independientes. Los hitos sin variables cuantitativas no reciben un progreso estimado.

La gráfica de Estrategia recrea las capas y el orden visual del PPT institucional. Los textos de justificación extraídos del manual se cargan desde `data/public/objective-notes.json` en el sitio público y desde `data/objective-notes.json` en desarrollo local.

## Uso y privacidad

Vea [README_ACTUALIZACION.md](README_ACTUALIZACION.md) para validar la planilla, generar los JSON y probar el sitio.

Este repositorio y GitHub Pages son públicos. El sitio carga JSON generados desde el Excel con `--public`, incluidos los responsables, suplentes, comentarios, evidencias y pendientes. Se abre con los 161 KR y permite filtrarlos por periodo, objetivo y Owner. Los 51 reportes de seguimiento ficticios están señalados como **DEMO**. Se publican las ocho justificaciones usadas en el esquema, pero el Excel, el manual y los JSON locales originales permanecen fuera de Git.
