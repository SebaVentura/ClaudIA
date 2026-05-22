"""Única fuente de catálogo: api/data/products.json"""
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
PRODUCTS_FILE = DATA_DIR / "products.json"

_DEFAULT_PRODUCTS = [
    {
        "id": "geo-tangram-inicial",
        "title": "Geometría y Tangram",
        "level": "Inicial",
        "age": "5 a 7 años",
        "description": "Taller visual, manipulativo y listo para imprimir.",
        "price": 6600,
        "badge": "Más elegido",
        "active": True,
        "image": None,
    },
    {
        "id": "division-primaria",
        "title": "División: repartos y estrategias",
        "level": "Primaria",
        "age": "2.º a 4.º grado",
        "description": "Secuencias didácticas para construir el sentido de la división con repartos y problemas cotidianos.",
        "price": 7200,
        "badge": None,
        "active": True,
        "image": None,
    },
    {
        "id": "cuerpos-geom-tecnica",
        "title": "Cuerpos geométricos en secundaria técnica",
        "level": "Técnica",
        "age": "1.º y 2.º año",
        "description": "Prismas, pirámides y desarrollos planos con fichas imprimibles para taller y geometría.",
        "price": 7800,
        "badge": None,
        "active": True,
        "image": None,
    },
    {
        "id": "irracionales-secundaria",
        "title": "Números irracionales",
        "level": "Secundaria",
        "age": "4.º año",
        "description": "Introducción guiada a √2 y π con representaciones, estimación y ejercicios.",
        "price": 7500,
        "badge": None,
        "active": True,
        "image": None,
    },
    {
        "id": "taller-logico-superior",
        "title": "Taller de Pensamiento Lógico Matemático",
        "level": "Superior",
        "age": "Profesorado",
        "description": "Propuestas para formación docente: razonamiento, demostración y diseño de situaciones.",
        "price": 8200,
        "badge": "Formación docente",
        "active": True,
        "image": None,
    },
    {
        "id": "ia-primera-experiencia",
        "title": "Mi primera experiencia con IA",
        "level": "IA educativa",
        "age": "Niños y docentes",
        "description": "Guía amable para usar IA en el aula con ética, ejemplos y actividades seguras.",
        "price": 6900,
        "badge": "Nuevo",
        "active": True,
        "image": None,
    },
]


def load_catalog() -> list[dict]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not PRODUCTS_FILE.exists():
        PRODUCTS_FILE.write_text(
            json.dumps(_DEFAULT_PRODUCTS, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return _DEFAULT_PRODUCTS
    return json.loads(PRODUCTS_FILE.read_text(encoding="utf-8"))


def catalog_by_id() -> dict[str, dict]:
    return {p["id"]: p for p in load_catalog() if p.get("id")}
