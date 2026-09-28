# Cómo actualizar el dashboard OKR

## 1. Preparar la planilla

Guarde la versión actual de `Planilla_Maestra_Dashboard_OKR_V2.xlsx` **fuera de la carpeta del repositorio**. Debe tener exactamente dos hojas: `Estrategia` y `Seguimiento`. No borre los registros anteriores de Seguimiento: cada fila es un reporte histórico.

En un terminal, abra la carpeta del repositorio. Instale Python 3 y la dependencia una sola vez:

```bash
python -m pip install -r requirements.txt
```

## 2. Validar

Cambie la ruta del ejemplo por la ubicación real del archivo:

```bash
python scripts/generate_data.py --input "/ruta/Planilla_Maestra_Dashboard_OKR_V2.xlsx" --validate-only
```

El programa informa la hoja, la fila y el campo si detecta columnas faltantes, ID KR repetidos o sin relación, periodos y fechas inválidos, estados o estatus incorrectos y métricas numéricas incompletas. La validación no modifica archivos. Para impedir el uso de reportes marcados `[DEMO]`, agregue `--require-real`.

## 3. Generar y revisar

```bash
python scripts/generate_data.py --input "/ruta/Planilla_Maestra_Dashboard_OKR_V2.xlsx"
```

Se crean `data/strategy.json`, `data/tracking.json` y `data/objective-notes.json`. Para actualizar los datos no es necesario editar el HTML o JavaScript. Revise el total de KR, reportes, Owners sin informar y advertencias DEMO que aparecen en la terminal. El script calcula el progreso solo si existen Línea base, Meta y Valor actual; el estatus se conserva según la evaluación informada.

El archivo `data/strategy-catalog.json` contiene la numeración, dimensiones, enunciados, subobjetivos y justificaciones oficiales de los ocho objetivos, extraídos de la especificación recibida. La planilla original conserva su numeración antigua; el generador traduce sus datos al catálogo sin alterar los códigos de KR. Revise el catálogo antes de cambiarlo.

Para generar los archivos destinados al sitio público, ejecute también:

```bash
python scripts/generate_data.py --input "/ruta/Planilla_Maestra_Dashboard_OKR_V2.xlsx" --public
```

Esta opción crea `data/public/strategy.json`, `data/public/tracking.json` y `data/public/objective-notes.json`. Publica todos los campos extraídos de la planilla, incluidos Owners, suplentes, comentarios de estrategia, evidencias, aprendizajes y pendientes. El tercer archivo contiene las justificaciones del catálogo, pero no el documento original. Si hay reportes `[DEMO]`, el sitio los identifica como ficticios. Revise los tres JSON antes de publicarlos. Las columnas opcionales `Tipo de KR` y `Asociado a CDC` se aceptan cuando existan en una planilla futura; no se infieren del nombre.

## 4. Probar localmente

```bash
python -m http.server 8000
```

Abra `http://localhost:8000` para revisar los archivos locales. Abra `http://localhost:8000/?publico=1` para comprobar la versión pública. De forma predeterminada se muestran todos los KR. Revise Panel general, Estrategia, Resultados Clave, Histórico y Cómo leer este panel; pruebe los filtros, la búsqueda, la vista de tabla, las fichas y el menú móvil. `assets/okr-config.js` declara **Apertura, semana 1** como estado simulado de Q3 2026. Cambie esa configuración solo cuando exista un estado de seguimiento validado. Use `Ctrl+C` para detener el servidor.

## 5. Publicar con autorización

**GitHub Pages y todas las ramas de este repositorio son públicos.** Cualquier persona puede descargar los JSON de `data/public/`, incluidos nombres y textos cualitativos. No suba la planilla, el manual, `data/strategy.json`, `data/tracking.json` ni `data/objective-notes.json` al repositorio público.

La versión actual publicada es una **demostración con 51 reportes ficticios**. Para una actualización oficial, use la planilla con datos definitivos, valide con `--require-real`, genere otra vez los JSON públicos y revise los datos expuestos antes de subirlos.
