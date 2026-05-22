"""Carga de variables de entorno desde api/.env (ruta fija, independiente del cwd)."""
import logging
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)


def log_startup_config() -> None:
    token = os.getenv("MP_ACCESS_TOKEN", "").strip()
    app_url = os.getenv("APP_URL", "http://localhost:5173")
    mp_env = os.getenv("MP_ENV", "sandbox")

    if ENV_PATH.exists():
        logging.info("Env file: %s", ENV_PATH)
    else:
        logging.warning(
            "Env file not found at %s — copiá api/.env.example a api/.env",
            ENV_PATH,
        )

    logging.info("MP_ACCESS_TOKEN loaded: %s", "yes" if token else "no")
    logging.info("APP_URL: %s", app_url)
    logging.info("MP_ENV: %s", mp_env)


def mp_access_token() -> str:
    return os.getenv("MP_ACCESS_TOKEN", "").strip()
