from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    OLLAMA_BASE_URL: str = None
    OLLAMA_CHAT_MODEL: str = None
    OLLAMA_EMBEDDINGS_MODEL: str = None

    PROJECT_NAME: Optional[str] = "REST API"
    VERSION: Optional[str] = "v0.0.1"



settings = Settings()
