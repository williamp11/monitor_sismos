#!/usr/bin/env python3
import json
from pathlib import Path

entrada = Path("data/earthquakes.json")
salida = Path("data/earthquakes_firebase.json")

sismos = json.loads(entrada.read_text(encoding="utf-8"))
arbol = {"earthquakes": {sismo["id"]: sismo for sismo in sismos}}

salida.write_text(json.dumps(arbol, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"{len(arbol['earthquakes'])} sismos guardados en {salida}")