# Panel de Seguimiento Corfo, versión 4

Versión independiente con el diseño recibido el 1 de octubre de 2026. Las rutas del panel principal, `version-jefatura/` y `v3/` se conservan.

**Resultados Clave (KR)** muestra el catálogo completo de 161 KR de la hoja Estrategia, incluidos los que no tienen registros en Seguimiento, identificados como **Sin reporte**. El filtro de periodo incluye los KR con meta en ese periodo y los que tengan un reporte correspondiente. Los filtros de Owner y área incluyen las opciones del catálogo completo. El detalle de un KR sin seguimiento muestra su definición y la ausencia de reportes, sin asignarle 0% de avance.

El **Panel general**, el seguimiento de Estrategia y la Bitácora de avances conservan el alcance de los KR reportados en Seguimiento. Si se selecciona un periodo, estas vistas solo incluyen los KR reportados en ese periodo. Actualmente tienen dos KR y seis reportes.

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
| `data/strategy.json` | Las 161 definiciones de KR de Estrategia, incluidos Owner y área, y el catálogo de los ocho objetivos. |
| `data/tracking.json` | Los seis reportes de Seguimiento, con métricas y textos completos. |
| `okr-app.js` | Configuración compartida, nombres de objetivos, navegación y filtros. |
| `*.dc.html` | Diseño y comportamiento de cada pantalla. |

Los ID deben coincidir entre ambos JSON. `progress` se expresa entre 0 y 100 (40 significa 40%). Las fechas se expresan como `AAAA-MM-DD` y los periodos como `AAAA/Qn`. `status` usa `On Track`, `Off Track` o `At Risk`; `execution` usa `No iniciado`, `En proceso` o `Completado`. `demo: true` identifica los reportes de ejemplo. Los valores numéricos no informados se guardan como `null`, sin reemplazarlos por cero. `source_row` conserva la fila de origen en Seguimiento.

Para agregar un KR al catálogo, incorporar su definición en `strategy.json`. Se mostrará en Resultados Clave como Sin reporte hasta que se agregue un registro con el mismo ID en `tracking.json`. El Panel general incorpora ese KR cuando tiene seguimiento. Al modificar manualmente los JSON, mantener los conteos de `metadata` actualizados. La fecha y etapa del ciclo trimestral se calculan desde la fecha del navegador; v4 no aplica la simulación de Q3 de v3.

## Regeneración desde Excel

Desde la raíz del repositorio:

```bash
python v4/build_v4_data.py --input "/ruta/Planilla-Maestra-Seguimiento-Dashboard-OKR-vf(1).xlsx"
```

Este comando valida ambas hojas, exporta todas las definiciones de Estrategia y reemplaza los reportes con los registros de Seguimiento. Reemplaza también cualquier edición manual previa de esos JSON. No modifica las pantallas de diseño ni las versiones anteriores.

Para desplegar en el servidor de Corfo, copiar el contenido de `v4/`, con sus carpetas `data/`, `assets/` y `_ds/`, al directorio que indique TI. La entrada es `index.html`. El runtime actual carga React, React DOM y Babel desde `unpkg.com`; TI debe confirmar que los navegadores internos permiten esos recursos o servir las dependencias localmente al preparar la migración.

El Excel, los Word, los manuales, el ZIP de origen y la carpeta de insumos no se publican.
