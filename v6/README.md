# Dashboard OKR Corfo V6

Versión incorporada el 14 de octubre de 2026 desde la carpeta `publicar` del ZIP “Rediseño Panel general OKR Corfo v6 (1).zip”.

## Acceso

- Sitio: https://estrategiacorfo.github.io/okr-corfo-dashboard/v6/
- Entrada local: `index.html`, que abre `Panel general.dc.html`.

## Datos de esta entrega

El sitio incluye el catálogo de 161 KR actualizado desde la hoja BD-Estrategia-Consolidada y 17 reportes reales de cierre de Q3 2026, con fecha de reporte 9 de octubre de 2026. Los cierres quedaron como Confirmado GE, según la validación del equipo. Hay 9 KR completados y 8 en proceso.

Q3 2026 fue el primer ciclo de seguimiento y contiene únicamente la instancia de Cierre. Los registros de demostración fueron reemplazados por estos reportes reales.

Los archivos de datos están en `data/strategy.json`, `data/tracking.json` y `data/objective-notes.json`.

KR-001 se actualizó el 14 de octubre de 2026 por instrucción del equipo: métrica de 100 %, confianza Alto (On Track), ejecución Completado y comentario cualitativo de cierre. La corrección queda registrada en los metadatos de `tracking.json`. La fecha del reporte de cierre sigue siendo el 9 de octubre de 2026.

## Actualización desde Excel

Desde la raíz del repositorio, ejecutar:

    python v6/build_v6_data.py --input "Planilla.xlsx" --confirm-ge

Antes de regenerar los JSON, incorporar en la planilla maestra la corrección de KR-001 descrita arriba para conservarla.

El conversor requiere openpyxl, valida el cruce por ID de KR y lee las hojas BD-Estrategia-Consolidada y Seguimiento. El parámetro --confirm-ge registra todos los cierres como Confirmado GE cuando el equipo ya los ha validado. Si se omite, se conserva la clasificación de la planilla.

La métrica porcentual se toma de la columna L, respetando su formato de porcentaje. Estado de ejecución, métrica y nivel de confianza se conservan como variables independientes. Las celdas vacías se mantienen diferenciadas de un cero informado.

Se conservan los comentarios, evidencias, aprendizajes, pendientes, tratamientos y notas de traspaso. El detalle del KR muestra los campos adicionales cuando tienen contenido. Los aprendizajes de Estrategia se muestran por separado cuando difieren del aprendizaje general.

## Pendiente de desarrollo

Crear una tabla de KR trasladados. Cada traslado debe conservar el mismo ID de KR y permitir revisar su periodo de origen, destino y comentario. Por ahora se conserva el texto de Periodo de traspaso y se muestra como Nota de traspaso en el detalle; el periodo meta del catálogo sigue el informado en la planilla.

## Publicación

La versión se guarda en `v6/` siguiendo la estructura de versiones del repositorio. GitHub Pages publica desde `main`. La incorporación a este repositorio no realiza un despliegue en los servidores QA o producción de Corfo.

