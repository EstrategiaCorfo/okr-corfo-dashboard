# Panel de Seguimiento Corfo, versión 5

Versión independiente con el diseño y la planilla recibidos el 2 de octubre de 2026. Las versiones anteriores conservan sus rutas y archivos. La entrada es `v5/index.html`.

## Datos y alcance

`data/strategy.json` contiene los 161 KR de **Estrategia**, con los ocho objetivos, sus visiones y justificaciones, subobjetivos, fechas meta, productos referenciales, áreas responsables, Owners y suplentes. Los textos de la vista Estrategia y los filtros se alimentan de este catálogo. Las dimensiones de origen se conservan en JSON; la vista mantiene los nombres de grupos del diseño (Impacto, Impulso Corfo, Rol de Corfo y Habilitantes).

`data/tracking.json` contiene las siete filas con ID de la hoja **Seguimiento_KR** de la planilla corregida. Corresponden a Q4 2026, con fecha 16 de noviembre de 2026 e instancia del registro Confirmado GE. KR-108 y KR-109 tienen tres reportes cada uno, marcados como DEMO en el origen; se conservan y se identifican como datos de demostración. KR-110 tiene un registro con instancia **Pendiente**, ejecución y confianza **No iniciado**, y métrica declarada de 10%. Los valores y fechas se conservan tal como están en la planilla. Esta planilla solo contiene Estrategia y Seguimiento_KR; cualquier otra hoja queda fuera de la conversión.

Resultados Clave muestra los 161 KR al seleccionar Todos los periodos: tres con registro y 158 como **Sin reporte**. El filtro por periodo incluye los KR programados para ese trimestre o con registro en él. Panel general y Estrategia utilizan el catálogo completo del diseño v5; sus avances provienen únicamente de Seguimiento_KR. La Bitácora muestra los KR que tienen registros y permite filtrar la instancia Pendiente sin asignarla a otra etapa del ciclo.

El diseño incorpora fecha meta, Estado del KR, Métrica de progreso y Nivel de confianza en la tabla. El detalle conserva el gráfico de avance solicitado, con las métricas disponibles y una indicación cuando todavía no hay porcentajes. El Owner definido en Estrategia sigue visible. Como la planilla corregida no contiene Owner en Seguimiento_KR, el detalle usa el del catálogo y lo identifica como **Owner definido en Estrategia**, sin atribuirlo al registro de seguimiento.

## Correspondencia de campos

| Planilla | JSON |
| --- | --- |
| Justificación | `objectives[].justification` y `krs[].justification`; también `objective-notes.json` |
| Producto asociado al KR (Referencial) | `krs[].product` |
| Área responsable | `krs[].area` |
| Owner (Lider y responsable) | `krs[].owner` |
| Owner, en Seguimiento_KR (opcional) | `records[].owner`; cadena vacía si la columna no existe |
| Estado de ejecución | `records[].execution` |
| Métrica (%) | `records[].progress`, en puntos porcentuales (40 significa 40%) |
| Nivel de confianza (semáforo) | `records[].status` y texto original en `source_status` |
| ¿Quedó pendiente de logro el KR? | `records[].pending` |
| Instancia | `instance`; Apertura de Q y Cierre de Q se normalizan a Apertura y Cierre; Pendiente se conserva; `source_instance` conserva el original |

Los encabezados con instrucciones en una segunda línea se reconocen por su primera línea. Los campos numéricos vacíos se exportan como `null`; los ceros informados siguen siendo ceros. Los campos de texto vacíos se exportan como cadena vacía. Las fechas se guardan en `AAAA-MM-DD` y los periodos en `AAAA/Qn`. `source_row` permite ubicar el registro de origen.

La Métrica (%) declarada tiene prioridad, incluida una estimación cualitativa. Solo si falta se calcula `(Valor actual - Línea base) / (Meta - Línea base) * 100`, cuando la base es válida. Con meta igual a línea base, no se calcula un porcentaje ni se sustituye la métrica declarada. `progress_basis` identifica si el porcentaje fue informado o calculado. `No iniciado` en el nivel de confianza se conserva como tal y no se convierte en On Track, Off Track ni At Risk. El filtro Sin reporte identifica los KR que no tienen registro, y el filtro No iniciado identifica la indicación de la planilla.

## Actualización

Desde la raíz del repositorio:

```bash
python v5/build_v5_data.py --input "/ruta/Planilla-Maestra-Seguimiento-Dashboard-OKR-vf 1(2).xlsx"
```

El comando valida las hojas y regenera los tres JSON de `v5/data/`. Reemplaza las ediciones manuales de estos datos; no modifica el diseño ni otras versiones. Los JSON y las pantallas pueden editarse directamente en GitHub. Mantener los ID coincidentes y los conteos de `metadata` actualizados.

Para el servidor de Corfo, copiar el contenido de `v5/` con sus carpetas `data/`, `assets/` y `_ds/`. El runtime actual requiere React, React DOM y Babel desde `unpkg.com`; al migrar, TI debe permitir esas dependencias o servirlas localmente. El ciclo trimestral usa la fecha del navegador.

El Excel, los Word, los manuales, el ZIP y los insumos de diseño no se publican.
