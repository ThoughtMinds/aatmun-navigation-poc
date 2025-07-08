from app.core.config import settings
from langchain_ollama.embeddings import OllamaEmbeddings
from langchain_ollama.chat_models import ChatOllama


def get_ollama_chat_model():
    """Initialize an Ollama Chat Model for LLM inference

    Returns:
        ChatOllama: Ollam Chat Model
    """
    return ChatOllama(
        base_url=settings.OLLAMA_BASE_URL,
        model=settings.OLLAMA_CHAT_MODEL,
    )


def get_ollama_embeddings_model():
    """Initialize an Ollama Embeddings Model for LLM inference

    Returns:
        OllamaEmbeddings: Ollama Embeddings model
    """
    return OllamaEmbeddings(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_EMBEDDINGS_MODEL)
