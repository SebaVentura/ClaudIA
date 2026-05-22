import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

STORAGE_DIR = Path(__file__).resolve().parent.parent / "storage"
ORDERS_FILE = STORAGE_DIR / "orders.json"


def _ensure_storage() -> None:
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    if not ORDERS_FILE.exists():
        ORDERS_FILE.write_text("[]", encoding="utf-8")


def _read_all() -> list[dict]:
    _ensure_storage()
    raw = ORDERS_FILE.read_text(encoding="utf-8")
    data = json.loads(raw)
    return data if isinstance(data, list) else []


def _write_all(orders: list[dict]) -> None:
    _ensure_storage()
    ORDERS_FILE.write_text(
        json.dumps(orders, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def create_pending_order(
    order_items: list[dict],
    total: float,
    buyer_email: str | None = None,
) -> dict:
    order = {
        "orderId": str(uuid4()),
        "status": "pending",
        "items": order_items,
        "total": total,
        "preferenceId": None,
        "buyerEmail": buyer_email,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    orders = _read_all()
    orders.append(order)
    _write_all(orders)
    return order


def update_preference_id(order_id: str, preference_id: str) -> None:
    orders = _read_all()
    for order in orders:
        if order.get("orderId") == order_id:
            order["preferenceId"] = preference_id
            break
    _write_all(orders)


def get_order(order_id: str) -> dict | None:
    for order in _read_all():
        if order.get("orderId") == order_id:
            return order
    return None
