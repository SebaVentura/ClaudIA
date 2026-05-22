from fastapi import APIRouter, HTTPException

from services.catalog import load_catalog

router = APIRouter(tags=["products"])


@router.get("/api/products")
def list_products():
    try:
        products = load_catalog()
    except Exception as exc:
        raise HTTPException(status_code=500, detail="No se pudo leer el catálogo") from exc
    if not isinstance(products, list):
        raise HTTPException(status_code=500, detail="Formato de catálogo inválido")
    return [p for p in products if p.get("active") is True]
