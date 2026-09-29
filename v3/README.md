# Panel de Seguimiento Corfo, versión 3

Esta ruta conserva el rediseño recibido el 29 de septiembre de 2026 como una versión independiente del panel principal y de `version-jefatura/`.

La planilla `Planilla-Maestra-Seguimiento-Dashboard-OKR-vf.xlsx` se transformó en `data/strategy.json` y `data/tracking.json`. Contiene 161 KR de estrategia y tres reportes ficticios de un solo KR, `KR-109`, en Q4 2026. La métrica registrada es 0%, 40% y 100%; el detalle muestra su evolución. El valor de 40% informado en la revisión intermedia difiere del cálculo a partir de Línea base 0, Valor actual 0 y Meta 1, por lo que se presenta una nota en el gráfico. Son datos de demostración, no avances institucionales oficiales.

Para regenerar los JSON desde la planilla sin subir el archivo original:

```bash
python v3/build_v3_data.py --input "/ruta/Planilla-Maestra-Seguimiento-Dashboard-OKR-vf.xlsx"
```

La versión pública incluye los Owners y los campos cualitativos del Excel. El archivo Excel, los manuales y el ZIP de diseño no forman parte del sitio publicado.
