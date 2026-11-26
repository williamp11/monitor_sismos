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

---

# Sprint 2: Componentes e interfaces React

Dashboard en React + Vite + TypeScript + Material UI (carpeta `dashboard/`), con datos de ejemplo de `data/earthquakes.json`.

## Ejecución
Requisito: Node.js 20 o superior.
```bash
cd dashboard
npm install
npm run dev      # http://localhost:5173
```
Las capturas de escritorio y móvil están en `docs/sprint2/`.

---

# Sprint 3: Conexión de React con Firebase

El dashboard ya no usa datos de ejemplo: lee los sismos desde Firebase Realtime Database (nodo `earthquakes`).

## Cargar los datos en Firebase

1. Generar el JSON con la estructura de Firebase (cada sismo queda dentro de `earthquakes`, identificado por su `id`):
   ```bash
   python scripts/json_to_firebase.py
   ```
   Se crea `data/earthquakes_firebase.json`.
2. En la consola de Firebase: **Realtime Database > ⋮ > Importar JSON** y seleccionar ese archivo.
3. En **Reglas**, permitir solo lectura pública:
   ```json
   { "rules": { ".read": true, ".write": false } }
   ```

## Código

- `dashboard/src/firebase/firebase.ts`: configuración del proyecto y conexión a la base de datos.
- `dashboard/src/services/earthquakeService.ts`: `obtenerSismos()`, que lee el nodo `earthquakes`.
- `dashboard/src/hooks/useFetchData.ts`: ejecuta la consulta con `useEffect` y guarda `data`, `loading` y `error` con `useState`.
- `dashboard/src/pages/DashboardPage.tsx`: usa el hook y calcula KPI, gráficos, mapa y tablas con los datos recuperados.

## Ejecución

```bash
cd dashboard
npm install
npm run dev      # http://localhost:5173
```

Las capturas del sprint están en `docs/sprint3/`.