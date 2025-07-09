from app.core.config import settings
from langchain_chroma import Chroma
from app import llm
from .parse_data import parse_navigation_data, get_documents

embeddings = llm.get_ollama_embeddings_model()

def get_vector_db() -> Chroma:
    """Loads or creates a Chroma object

    Returns:
        Chroma: A Chroma instance
    """
    try:
        vectordb = Chroma(
            persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
            embedding_function=embeddings,
        )
        print(f"Loaded Chroma database from {settings.CHROMA_PERSIST_DIRECTORY}")
    except:
        print(f"Creating Chroma database")
        navigation_data = []
        navigation_intents = parse_navigation_data(navigation_data=navigation_data)
        documents = get_documents(navigation_intents=navigation_intents)
        vectordb = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
        )
        print(f"Saved Chroma database at {settings.CHROMA_PERSIST_DIRECTORY}")
    return vectordb
    

