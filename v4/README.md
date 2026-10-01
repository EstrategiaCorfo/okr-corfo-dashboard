# Panel de Seguimiento Corfo, versión 4

Versión independiente con el diseño recibido el 1 de octubre de 2026. Las rutas del panel principal, `version-jefatura/` y `v3/` se conservan.

El panel muestra únicamente los KR con al menos un registro en la hoja **Seguimiento**. Si se selecciona un periodo, solo se incluyen los KR reportados en ese periodo. Los filtros, totales, alertas, bitácora y enlaces de detalle aplican esta regla.

## Datos de la planilla recibida

La planilla contiene 161 definiciones estratégicas y seis reportes de demostración de dos KR, todos en Q4 2026 y con fecha de reporte 16 de noviembre de 2026. Estos ejemplos están identificados como demostración en las vistas de seguimiento.

| KR | Apertura | Revisión intermedia | Cierre | Confianza al cierre |
| --- | ---: | ---: | ---: | --- |
| KR-108 | 0% | 30% | 40% | Bajo (At Risk) |
| KR-109 | 0% | 40% | 100% | Alto (On Track) |

Se conservan el Owner, área responsable, campos cualitativos, evidencias, aprendizajes y estado de ejecución tal como están informados en la planilla. El avance proviene de **Métrica (%)**. Para KR-109, la métrica de la revisión intermedia difiere del cálculo con Línea base, Valor actual y Meta; el gráfico muestra la métrica declarada y explica la diferencia. KR-108 tiene porcentajes declarados y no informa base, meta ni valor actual. Ambos KR tienen estado de ejecución «En proceso» en el cierre; este campo se conserva aunque KR-109 declare 100%.

## Archivos para editar desde GitHub

| Archivo | Contenido |
| --- | --- |
| `data/strategy.json` | Definiciones de los KR reportados, incluidos Owner y área. El catálogo de los ocho objetivos se conserva para el mapa estratégico. |
| `data/tracking.json` | Los seis reportes de Seguimiento, con métricas y textos completos. |
| `okr-app.js` | Configuración compartida, nombres de objetivos, navegación y filtros. |
| `*.dc.html` | Diseño y comportamiento de cada pantalla. |

Los ID deben coincidir entre ambos JSON. `progress` se expresa entre 0 y 100 (40 significa 40%). Las fechas se expresan como `AAAA-MM-DD` y los periodos como `AAAA/Qn`. `status` usa `On Track`, `Off Track` o `At Risk`; `execution` usa `No iniciado`, `En proceso` o `Completado`. `demo: true` identifica los reportes de ejemplo. Los valores numéricos no informados se guardan como `null`, sin reemplazarlos por cero. `source_row` conserva la fila de origen en Seguimiento.

Para agregar un KR, incorporar su definición en `strategy.json` y al menos un reporte con el mismo ID en `tracking.json`. El panel omite automáticamente las definiciones sin reporte. Al modificar manualmente los JSON, mantener los conteos de `metadata` actualizados. La fecha y etapa del ciclo trimestral se calculan desde la fecha del navegador; v4 no aplica la simulación de Q3 de v3.

## Regeneración desde Excel

Desde la raíz del repositorio:

```bash
python v4/build_v4_data.py --input "/ruta/Planilla-Maestra-Seguimiento-Dashboard-OKR-vf(1).xlsx"
```

Este comando valida ambas hojas, reemplaza los dos JSON con los datos de la planilla y elimina los ejemplos que no están en Seguimiento. Reemplaza también cualquier edición manual previa de esos JSON. No modifica las pantallas de diseño ni las versiones anteriores.

Para desplegar en el servidor de Corfo, copiar el contenido de `v4/`, con sus carpetas `data/`, `assets/` y `_ds/`, al directorio que indique TI. La entrada es `index.html`. El runtime actual carga React, React DOM y Babel desde `unpkg.com`; TI debe confirmar que los navegadores internos permiten esos recursos o servir las dependencias localmente al preparar la migración.

El Excel, los Word, los manuales, el ZIP de origen y la carpeta de insumos no se publican.
