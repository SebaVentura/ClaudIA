import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.mercadopago_service import MercadoPagoError, create_checkout_preference
from services.orders_store import create_pending_order, update_preference_id
from services.pricing import PricingError, validate_and_price_items

logger = logging.getLogger(__name__)

router = APIRouter(tags=["checkout"])


class CheckoutItemIn(BaseModel):
    productId: str
    quantity: int = Field(ge=1, le=10)


class CreatePreferenceRequest(BaseModel):
    items: list[CheckoutItemIn]
    buyerEmail: str | None = None


@router.post("/api/checkout/create-preference")
async def create_preference(body: CreatePreferenceRequest):
    if not body.items:
        raise HTTPException(status_code=400, detail="Carrito vacío")

    try:
        priced = validate_and_price_items(
            [{"productId": i.productId, "quantity": i.quantity} for i in body.items]
        )
    except PricingError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    order = create_pending_order(
        priced["order_items"],
        priced["total"],
        body.buyerEmail,
    )
    order_id = order["orderId"]

    try:
        mp_result = await create_checkout_preference(
            order_id,
            priced["mp_items"],
            body.buyerEmail,
        )
    except HTTPException:
        raise
    except MercadoPagoError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    except Exception as exc:
        logger.exception("Unexpected checkout error")
        raise HTTPException(
            status_code=500,
            detail="Error inesperado creando preferencia de pago",
        ) from exc

    preference_id = mp_result.get("preferenceId")
    if preference_id:
        update_preference_id(order_id, preference_id)

    return {
        "orderId": order_id,
        "preferenceId": preference_id,
        "initPoint": mp_result["initPoint"],
    }
