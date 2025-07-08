from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    OLLAMA_BASE_URL: str = None
    OLLAMA_CHAT_MODEL: str = None
    OLLAMA_EMBEDDINGS_MODEL: str = None



settings = Settings()
