# Dashboard OKR Corfo V2

Sitio estático de seguimiento de la Estrategia Corporativa 2026-2030. Incluye panel general, Key Results, detalle de KR, histórico y esquema interactivo de Estrategia.

## Modelo de datos

El dashboard lee `data/strategy.json` y `data/tracking.json`, generados desde las hojas **Estrategia** y **Seguimiento** de la planilla maestra. El ID KR relaciona ambas hojas. Todas las filas de Seguimiento se conservan; la vista actual prioriza Confirmado GE y luego la fecha más reciente, con Propuesta Owner como alternativa.

Estado de ejecución, progreso numérico y estatus cualitativo son tres variables independientes. Los hitos sin variables cuantitativas no reciben un progreso estimado.

La gráfica de Estrategia recrea las capas y el orden visual del PPT institucional. Los textos de justificación del manual se cargan solo desde el archivo local opcional `data/objective-notes.json`.

## Uso y privacidad

Vea [README_ACTUALIZACION.md](README_ACTUALIZACION.md) para validar la planilla, generar los JSON y probar el sitio.

Este repositorio y GitHub Pages son públicos. Los JSON, la planilla y el manual contienen datos internos y están excluidos de Git. Sin los JSON, la página Estrategia muestra el esquema público de ocho objetivos y las vistas de seguimiento muestran un aviso. La planilla recibida para desarrollar esta versión contiene 51 reportes marcados **[DEMO]**; no son avances oficiales.
