# Dashboard OKR Corfo

Maqueta funcional HTML/CSS/JS para seguimiento ejecutivo de la Estrategia Institucional Corfo 2026-2030.

## Versión actual

Versión V15 preparada para prueba en GitHub Pages.

## Contenido

- `index.html`: panel general por trimestre.
- `key-results.html`: vista filtrable de Key Results.
- `detalle-kr.html`: ficha de detalle por KR, con gráfico e historial de comentarios.
- `historico-avances.html`: tabla consolidada de avances.
- `metodologia.html`: definiciones estratégicas y metodología de seguimiento.
- `assets/okr-corfo.css`: estilos visuales del dashboard.
- `assets/okr-corfo.js`: lógica de carga, filtros y visualizaciones.
- `assets/logo-corfo-blanco.png`: logo Corfo del encabezado.
- `data/okr-data.json`: datos demo generados desde la planilla base.

## Datos

Los datos de avance para Q3 y Q4 2026 son ficticios y sirven únicamente para probar visualizaciones, filtros, semáforos, comentarios históricos y navegación.

## Uso local

Para probar correctamente la lectura del JSON, abrir la carpeta con un servidor local:

```bash
python -m http.server 8000
```

Luego entrar a:

```text
http://localhost:8000
```
