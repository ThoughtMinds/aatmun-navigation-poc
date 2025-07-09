from app.core.config import settings
from langchain_ollama.embeddings import OllamaEmbeddings
from langchain_ollama.chat_models import ChatOllama
from app import schema
from functools import wraps
from langchain_core.language_models import BaseChatModel


def with_navigation_output(func):
    """Decorator to wrap a function that returns a ChatOllama model with structured Navigation output."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        chat_model: BaseChatModel = func(*args, **kwargs)
        return chat_model.with_structured_output(schema.Navigation, method="json_schema")

    return wrapper


@with_navigation_output
def get_ollama_chat_model():
    """Initialize an Ollama Chat Model for LLM inference

    Returns:
        ChatOllama: Ollam Chat Model
    """
    return ChatOllama(
        base_url=settings.OLLAMA_BASE_URL,
        model=settings.OLLAMA_CHAT_MODEL,
    )


@with_navigation_output
def get_ollama_chat_fallback_model():
    """Initialize a fallback Ollama Chat Model for LLM inference

    Returns:
        ChatOllama: Ollam Chat Model
    """
    return ChatOllama(
        base_url=settings.OLLAMA_BASE_URL,
        model=settings.OLLAMA_CHAT_FALLBACK_MODEL,
    )


def get_ollama_embeddings_model():
    """Initialize an Ollama Embeddings Model for LLM inference

    Returns:
        OllamaEmbeddings: Ollama Embeddings model
    """
    return OllamaEmbeddings(
        base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_EMBEDDINGS_MODEL
    )
