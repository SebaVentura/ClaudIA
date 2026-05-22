import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import config
from routers import checkout, products

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
config.log_startup_config()

app = FastAPI(
    title="ClaudIA Educación Digital API",
    version="0.1.0",
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(checkout.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "claudia-api", "phase": 4}
