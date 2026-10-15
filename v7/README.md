# Dashboard OKR Corfo V7

Versión incorporada el 15 de octubre de 2026 desde la carpeta `publicar` del ZIP Rediseño Panel general OKR Corfo v7. Se conserva el diseño de la entrega y se generan sus datos desde la planilla actualizada `20260806 Estrategia_PE_2030_vf.xlsx`.

## Acceso

- Sitio: https://estrategiacorfo.github.io/okr-corfo-dashboard/v7/
- Entrada: `index.html`, que abre `Panel general.dc.html`.
- Cierre de Q3: `Panel general.dc.html?periodo=2026%2FQ3`.

## Datos de esta entrega

Catálogo de 161 KR y 17 reportes reales de cierre de Q3 2026, con fecha 9 de octubre de 2026. Los registros se mantienen Confirmado GE por la validación previamente indicada por el equipo, conservando la instancia original de la planilla en `source_moment`.

Hay 9 KR completados y 8 en proceso. La confianza es alta para 12 KR, media para 2 y baja para 3. Los 17 reportes contienen comentario cualitativo y acciones realizadas. Santiago Browne se toma con el nombre corregido de la planilla.

Solo se incluyen los cierres efectivamente informados. No se generan aperturas, revisiones intermedias ni reportes futuros.

## Campos y próximos resultados clave

| Campo del dashboard | Hoja Seguimiento |
| --- | --- |
| Métrica porcentual | K: Métrica (%) |
| Nivel de confianza | L: Nivel de confianza (semáforo) |
| Comentario cualitativo | M: Comentario cualitativo (máximo 500 caracteres) |
| Evidencia o soporte | N: Evidencia / soporte |
| Aprendizaje | O: Aprendizaje |
| Acciones realizadas | P: Acciones realizadas |
| Aprendizaje de Estrategia | Q: Aprendizaje Estrategia |
| Pendiente de logro | R: ¿Quedó pendiente de logro el KR? |
| Nota de traspaso | S: Periodo de traspaso |

Los próximos resultados clave se muestran siguiendo la secuencia del mismo subobjetivo en el catálogo BD-Estrategia-Consolidada, con sus ID, nombres y periodos meta. Las acciones y acuerdos se muestran desde la columna P, sin convertir su texto en cambios automáticos de nombre o fecha de los KR futuros.

El detalle de cada KR incluye comentario, evidencia, acciones y aprendizajes. Los pendientes y las notas de traspaso se muestran cuando tienen contenido. La métrica, la ejecución y la confianza son variables independientes. Las celdas vacías permanecen vacías en los JSON y los campos cuantitativos que ya no están en la planilla se conservan como `null`.

## Actualización desde Excel

Desde la raíz del repositorio:

    python v7/build_v7_data.py --input "20260806 Estrategia_PE_2030_vf.xlsx" --confirm-ge

Requiere openpyxl. El conversor identifica las columnas por encabezado y valida IDs, nombres, objetivos, subobjetivos, duplicados, periodos y porcentajes antes de escribir los JSON. No modifica la planilla. `--confirm-ge` aplica la confirmación del equipo; sin ese parámetro se conserva la instancia del registro de la fuente.

La procedencia de cada registro, sus columnas fuente y el hash SHA-256 de la planilla quedan registrados en los JSON. La planilla y los demás archivos de trabajo del ZIP no se publican en el repositorio.

## Pendiente de desarrollo

La tabla de KR trasladados sigue pendiente, según lo acordado. Se conserva el mismo ID y se publica el texto de traspaso de la planilla en el detalle del KR. El periodo meta del catálogo sigue el informado en la hoja consolidada.

## Publicación

GitHub Pages publica desde `main`. La v7 está en `v7/`; las versiones anteriores conservan sus archivos. Esta publicación no realiza un despliegue en los servidores institucionales QA o producción de Corfo.
