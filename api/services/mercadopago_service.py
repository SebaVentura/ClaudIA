import json
import logging
import os

import httpx

from config import mp_access_token

logger = logging.getLogger(__name__)

MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences"


class MercadoPagoError(Exception):
    def __init__(self, message: str, *, status_code: int = 500):
        self.message = message
        super().__init__(message)
        self.status_code = status_code


def _should_include_auto_return(app_url: str) -> bool:
    lower = app_url.lower()
    if "localhost" in lower or "127.0.0.1" in lower:
        return False
    return app_url.startswith("https://")


def _resolve_init_point(preference: dict) -> str:
    env = os.getenv("MP_ENV", "sandbox").lower()
    if env == "sandbox":
        point = preference.get("sandbox_init_point") or preference.get("init_point")
    else:
        point = preference.get("init_point") or preference.get("sandbox_init_point")
    if not point:
        raise MercadoPagoError("Mercado Pago no devolvió URL de checkout", status_code=502)
    return point


def _format_mp_error_detail(response: httpx.Response) -> str:
    body_text = response.text
    logger.error("Mercado Pago preference error status: %s", response.status_code)
    logger.error("Mercado Pago preference error body: %s", body_text)

    parts: list[str] = []
    try:
        body = json.loads(body_text) if body_text.strip() else {}
        if isinstance(body, dict):
            for key in ("message", "error", "cause"):
                val = body.get(key)
                if val is not None and val != "":
                    parts.append(f"{key}: {val}")
    except json.JSONDecodeError:
        if body_text.strip():
            parts.append(body_text.strip()[:500])

    if parts:
        return " | ".join(parts)
    return "Revisar logs del backend."


async def create_checkout_preference(
    order_id: str,
    mp_items: list[dict],
    buyer_email: str | None = None,
) -> dict:
    token = mp_access_token()
    if not token:
        raise MercadoPagoError(
            "Mercado Pago no está configurado en el backend",
            status_code=500,
        )

    app_url = os.getenv("APP_URL", "http://localhost:5173").rstrip("/")
    include_auto_return = _should_include_auto_return(app_url)

    payload: dict = {
        "items": mp_items,
        "external_reference": order_id,
        "back_urls": {
            "success": f"{app_url}/gracias?orderId={order_id}&status=success",
            "failure": f"{app_url}/gracias?orderId={order_id}&status=failure",
            "pending": f"{app_url}/gracias?orderId={order_id}&status=pending",
        },
        "metadata": {
            "order_id": order_id,
            "source": "claudia_landing",
        },
    }

    if include_auto_return:
        payload["auto_return"] = "approved"

    if buyer_email and buyer_email.strip():
        payload["payer"] = {"email": buyer_email.strip()}

    logger.info(
        "Mercado Pago preference payload (sanitized): %s",
        json.dumps(payload, ensure_ascii=False),
    )
    logger.info("auto_return included: %s", "yes" if include_auto_return else "no")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                MP_PREFERENCES_URL,
                json=payload,
                headers=headers,
            )
    except httpx.HTTPError as exc:
        raise MercadoPagoError("No se pudo conectar con Mercado Pago", status_code=502) from exc

    logger.info("Mercado Pago preference response status: %s", response.status_code)

    if response.status_code >= 400:
        mp_detail = _format_mp_error_detail(response)
        api_status = 400 if 400 <= response.status_code < 500 else 502
        raise MercadoPagoError(
            f"Mercado Pago rechazó la preferencia: {mp_detail}",
            status_code=api_status,
        )

    data = response.json()
    init_point = _resolve_init_point(data)
    return {
        "preferenceId": data.get("id"),
        "initPoint": init_point,
    }
