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

Se crean `data/strategy.json` y `data/tracking.json`. No edite el HTML o JavaScript. Revise el total de KR, reportes, Owners sin informar y advertencias DEMO que aparecen en la terminal. El script calcula el progreso solo si existen Línea base, Meta y Valor actual; el estatus se conserva según la evaluación informada.

El archivo local `data/objective-notes.json` guarda las justificaciones tomadas del manual. Se prepara una vez con la clave exacta de cada Objetivo Estratégico. Si cambia el nombre de un objetivo, actualice esa clave para mantener la justificación visible. El documento original no forma parte del repositorio.

Para generar los archivos destinados al sitio público, ejecute también:

```bash
python scripts/generate_data.py --input "/ruta/Planilla_Maestra_Dashboard_OKR_V2.xlsx" --public --notes data/objective-notes.json
```

Esta opción crea `data/public/strategy.json`, `data/public/tracking.json` y, si se indica `--notes`, `data/public/objective-notes.json`. Publica todos los campos extraídos de la planilla, incluidos los Owners, suplentes, comentarios de estrategia, evidencias, aprendizajes y pendientes. El tercer archivo contiene las justificaciones extraídas del manual, pero no el documento. Si hay reportes `[DEMO]`, el sitio los identifica como ficticios. Revise los tres JSON antes de publicarlos.

## 4. Probar localmente

```bash
python -m http.server 8000
```

Abra `http://localhost:8000` para revisar los archivos locales. Abra `http://localhost:8000/?publico=1` para comprobar exactamente la versión que verá el público. De forma predeterminada se muestran todos los KR. Revise Panel general, Key Results, Detalle, Histórico y Estrategia; pruebe los filtros de periodo y Owner, los campos de cada reporte y los enlaces. Use `Ctrl+C` para detener el servidor.

## 5. Publicar con autorización

**GitHub Pages y todas las ramas de este repositorio son públicos.** Cualquier persona puede descargar los JSON de `data/public/`, incluidos nombres y textos cualitativos. No suba la planilla, el manual, `data/strategy.json`, `data/tracking.json` ni `data/objective-notes.json` al repositorio público.

La versión actual publicada es una **demostración con 51 reportes ficticios**. Para una actualización oficial, use la planilla con datos definitivos, valide con `--require-real`, genere otra vez los JSON públicos y revise los datos expuestos antes de subirlos.
