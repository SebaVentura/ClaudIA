from services.catalog import catalog_by_id


class PricingError(Exception):
    pass


def validate_and_price_items(items: list[dict]) -> dict:
    """
    Valida productId/cantidad contra api/data/products.json.
    Retorna items para MP, items normalizados del pedido y total.
    """
    if not items:
        raise PricingError("Carrito vacío")

    catalog = catalog_by_id()
    mp_items: list[dict] = []
    order_items: list[dict] = []
    total = 0

    for raw in items:
        product_id = raw.get("productId")
        quantity = raw.get("quantity")

        if not product_id:
            raise PricingError("productId requerido")
        if quantity is None or not isinstance(quantity, int):
            raise PricingError("Cantidad inválida")
        if quantity < 1:
            raise PricingError("La cantidad debe ser al menos 1")
        if quantity > 10:
            raise PricingError("Cantidad máxima por producto: 10")

        product = catalog.get(product_id)
        if not product:
            raise PricingError(f"Producto no encontrado: {product_id}")
        if product.get("active") is not True:
            raise PricingError(f"Producto no disponible: {product_id}")

        unit_price = float(product["price"])
        line_total = unit_price * quantity
        total += line_total

        title = product["title"]
        description = (product.get("description") or title)[:256]

        mp_items.append(
            {
                "id": product_id,
                "title": title,
                "description": description,
                "quantity": quantity,
                "currency_id": "ARS",
                "unit_price": unit_price,
            }
        )
        order_items.append(
            {
                "productId": product_id,
                "title": title,
                "quantity": quantity,
                "unitPrice": unit_price,
            }
        )

    return {
        "mp_items": mp_items,
        "order_items": order_items,
        "total": total,
    }
