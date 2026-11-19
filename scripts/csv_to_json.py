#!/usr/bin/env python3
"""Transforma el CSV de sismos del USGS a JSON, listo para cargarlo en Firebase.

Uso:
    python scripts/csv_to_json.py --download      # descarga el CSV y lo convierte
    python scripts/csv_to_json.py                 # convierte data/earthquakes.csv
"""
import argparse
import csv
import json
import math
import re
import sys
import urllib.request
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.csv"

# Campos del JSON, en el orden en que se escriben.
FIELDS = ("id", "time", "latitude", "longitude", "depth", "mag",
          "magType", "status", "place", "region")
NUMERIC = ("latitude", "longitude", "depth", "mag")
TEXT = ("magType", "status", "place")
REQUIRED = ("id", "time", "latitude", "longitude")  # sin estos no se puede ubicar el sismo
RANGES = {"latitude": (-90, 90), "longitude": (-180, 180),
          "depth": (-10, 1000), "mag": (-2, 10)}
ISO_UTC = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$")


def clean(value):
    """Quita espacios sobrantes; los textos vacíos pasan a None (null en JSON)."""
    if value is None:
        return None
    value = " ".join(value.split())
    return value or None


def to_number(value, name):
    number = float(value)  # lanza ValueError si no es numérico
    low, high = RANGES[name]
    if not math.isfinite(number) or not low <= number <= high:
        raise ValueError(f"{name} fuera de rango")
    return number


def to_iso_utc(value):
    dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def region_from(place):
    """Región o país: el texto después de la última coma (o todo el lugar si no hay coma)."""
    if place is None:
        return None
    return place.rsplit(",", 1)[-1].strip() if "," in place else place


def transform(rows):
    records, seen = [], set()
    stats = {"leidos": 0, "descartados": Counter(), "nulos": Counter(), "inconsistentes": Counter()}
    for row in rows:
        stats["leidos"] += 1
        raw = {k: clean(row.get(k)) for k in FIELDS if k != "region"}

        missing = [k for k in REQUIRED if raw[k] is None]
        if missing:
            stats["descartados"]["falta " + ", ".join(missing)] += 1
            continue
        if raw["id"] in seen:
            stats["descartados"]["id duplicado"] += 1
            continue

        rec = {"id": raw["id"]}
        try:
            rec["time"] = to_iso_utc(raw["time"])
            rec["latitude"] = to_number(raw["latitude"], "latitude")
            rec["longitude"] = to_number(raw["longitude"], "longitude")
        except ValueError:
            stats["descartados"]["tiempo o coordenadas inválidos"] += 1
            continue

        for name in ("depth", "mag"):  # opcionales: si fallan, quedan en null
            if raw[name] is None:
                rec[name] = None
                stats["nulos"][name] += 1
                continue
            try:
                rec[name] = to_number(raw[name], name)
            except ValueError:
                rec[name] = None
                stats["inconsistentes"][name] += 1

        for name in TEXT:
            value = raw[name]
            if value is not None and name != "place":
                value = value.lower()  # magType y status siempre en minúscula
            rec[name] = value
            if value is None:
                stats["nulos"][name] += 1
        rec["region"] = region_from(rec["place"])

        seen.add(rec["id"])
        records.append({k: rec[k] for k in FIELDS})
    return records, stats


def validate(path, expected):
    """Relee el JSON y comprueba estructura, cantidad de registros y tipos."""
    errors = []
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, list):
        return ["la raíz del JSON no es un arreglo"]
    if len(data) != expected:
        errors.append(f"se esperaban {expected} registros y hay {len(data)}")
    for i, r in enumerate(data):
        if tuple(r.keys()) != FIELDS:
            errors.append(f"registro {i}: campos distintos a los esperados")
            continue
        if not isinstance(r["id"], str) or not ISO_UTC.match(str(r["time"])):
            errors.append(f"registro {i}: id o time con formato incorrecto")
        for k in NUMERIC:
            v = r[k]
            if v is None:
                ok = k in ("depth", "mag")  # solo estos pueden faltar
            else:
                ok = isinstance(v, (int, float)) and not isinstance(v, bool)
            if not ok:
                errors.append(f"registro {i}: {k} no es numérico")
        for k in TEXT + ("region",):
            v = r[k]
            if v is not None and (not isinstance(v, str) or v != v.strip()):
                errors.append(f"registro {i}: {k} no es texto limpio")
    return errors[:10]


def main():
    parser = argparse.ArgumentParser(description="Convierte el CSV de sismos del USGS a JSON.")
    parser.add_argument("--input", default="data/earthquakes.csv", help="CSV de entrada")
    parser.add_argument("--output", default="data/earthquakes.json", help="JSON de salida")
    parser.add_argument("--download", action="store_true", help="descarga el CSV del USGS antes de convertir")
    args = parser.parse_args()

    src, dst = Path(args.input), Path(args.output)
    if args.download:
        src.parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(URL, src)
        print(f"CSV descargado en {src}")
    if not src.exists():
        sys.exit(f"No existe {src}. Use --download o copie allí el CSV.")

    with src.open(encoding="utf-8-sig", newline="") as f:
        records, stats = transform(csv.DictReader(f))

    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Registros leídos:     {stats['leidos']}")
    print(f"Registros válidos:    {len(records)}")
    print(f"Registros descartados: {sum(stats['descartados'].values())}")
    for reason, n in stats["descartados"].items():
        print(f"  - {reason}: {n}")
    for label, key in (("Valores vacíos (null)", "nulos"), ("Valores inconsistentes (null)", "inconsistentes")):
        print(f"{label}: " + (", ".join(f"{k}={v}" for k, v in stats[key].items()) or "ninguno"))

    errors = validate(dst, len(records))
    if errors:
        print("Validación del JSON: ERRORES")
        print("\n".join("  - " + e for e in errors))
        sys.exit(1)
    print(f"Validación del JSON: OK ({len(records)} registros en {dst})")


if __name__ == "__main__":
    main()
