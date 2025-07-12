from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    OLLAMA_BASE_URL: str
    OLLAMA_CHAT_MODEL: str
    OLLAMA_CHAT_FALLBACK_MODEL: str
    OLLAMA_EMBEDDINGS_MODEL: str

    DATABASE_INIT_DATA: str
    CHROMA_PERSIST_DIRECTORY: str

    PROJECT_NAME: Optional[str] = "REST API"
    VERSION: Optional[str] = "v0.0.1"


settings = Settings()
