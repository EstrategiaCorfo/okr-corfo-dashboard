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

El archivo local opcional `data/objective-notes.json` guarda las justificaciones tomadas del manual. Se prepara una vez con la clave exacta de cada Objetivo Estratégico y no forma parte del Excel ni del repositorio público. Si cambia el nombre de un objetivo, actualice esa clave para mantener la justificación visible.

## 4. Probar localmente

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`. Revise Panel general, Key Results, Detalle, Histórico y Estrategia. Pruebe los filtros de Periodo, Objetivo y Owner en conjunto; seleccione un objetivo en el esquema. Use `Ctrl+C` para detener el servidor.

## 5. Publicar con autorización

**GitHub Pages y todas las ramas de este repositorio son públicos.** Los JSON permiten descargar los nombres de Owners, comentarios, evidencias, aprendizajes y pendientes, aunque esos datos no aparezcan en una vista concreta. No suba la planilla, el manual, `data/strategy.json`, `data/tracking.json` ni `data/objective-notes.json` al repositorio público.

Antes de publicar datos, defina con los responsables institucionales si el tablero será interno con acceso restringido o si se aprobará una versión pública con campos y contenidos revisados. En el primer caso, copie la aplicación y los JSON generados a un alojamiento interno con autenticación. En el segundo, revise y apruebe cada campo de los JSON y genere un conjunto autorizado para el sitio público. El código del PR puede revisarse sin publicar esos datos.

La rama `dashboard-v2` y el PR hacia `main` contienen únicamente código, documentación y el recurso visual del PPT. No fusione el PR hasta completar esa decisión y las pruebas con datos definitivos.
