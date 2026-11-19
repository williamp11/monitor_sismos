# Monitor de Sismos USGS – Sprint 1: CSV a JSON

Convierte el CSV de sismos del USGS (últimos 30 días, magnitud 2.5 o mayor) a un JSON limpio, listo para cargarlo en Firebase y usarlo en el dashboard.

- **Fuente:** https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.csv
- **Requisito:** Python 3.8 o superior (solo usa la biblioteca estándar).

## Archivos

- `data/earthquakes.csv`: datos originales descargados del USGS.
- `data/earthquakes.json`: resultado de la transformación.
- `scripts/csv_to_json.py`: script de transformación y validación.

## Ejecución

Desde la raíz del repositorio:

```bash
python scripts/csv_to_json.py --download
```

`--download` baja el CSV actual a `data/earthquakes.csv`. Sin esa opción, el script convierte el CSV que ya esté en esa ruta. También se pueden indicar otras rutas con `--input` y `--output`.

## Qué hace el script

1. Lee el CSV y conserva `id`, `time`, `latitude`, `longitude`, `depth`, `mag`, `magType`, `status` y `place`.
2. Elimina espacios sobrantes y convierte los textos vacíos en `null`.
3. Convierte `latitude`, `longitude`, `depth` y `mag` a números, y `time` a formato ISO 8601 en UTC.
4. Pasa `magType` y `status` a minúscula y calcula `region` (texto después de la última coma de `place`).
5. Descarta los registros sin `id`, `time` o coordenadas válidas, y los `id` repetidos. Una `depth` o `mag` inválida o fuera de rango se guarda como `null`.
6. Escribe el JSON, lo vuelve a leer y valida su estructura, tipos y cantidad de registros. Al final imprime un resumen.