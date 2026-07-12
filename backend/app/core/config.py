import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = (
            os.path.join(BASE_DIR, ".env"),
            os.path.join(BASE_DIR, "app", ".env"),
            ".env"
        )
        extra = "ignore"

settings = Settings()
