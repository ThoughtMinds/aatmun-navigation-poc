from app.core.config import settings
from langchain_chroma import Chroma
from app import llm
from .parse_data import get_documents
from app import db
from sqlmodel import Session
from app import api


embeddings = llm.get_ollama_embeddings_model()


def get_vector_db() -> Chroma:
    """Loads Chroma database

    Returns:
        Chroma: A Chroma instance
    """
    vectordb = Chroma(
        persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
        embedding_function=embeddings,
    )
    print(f"Loaded Chroma database from {settings.CHROMA_PERSIST_DIRECTORY}")
    return vectordb


def create_vector_db() -> None:
    """Create Chroma database if not exists"""
    try:
        vectorstore = Chroma(
            persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
            embedding_function=embeddings,
            collection_name="Navigation_Collection"
        )
        assert len(vectorstore.get()['documents']) != 0
        print(f"Chroma database loaded from {settings.CHROMA_PERSIST_DIRECTORY}")
    except Exception as e:
        print(f"Could not load Chroma database from {{settings.CHROMA_PERSIST_DIRECTORY}}")
        print("Creating Chroma database")
        session = Session(db.engine)
        navigation_data = api.read_intents(session=session)
        if len(navigation_data) == 0:
            api.insert_example_intents(session=session)
            print("Inserting Navigation Intents to Database")
            navigation_data = api.read_intents(session=session)
        print("Reading Navigation Intents from Database")
        documents = get_documents(navigation_intents=navigation_data)
        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
            collection_name="Navigation_Collection"
        )
        print(f"Added {len(vectorstore.get()['documents'])} Intents to Chroma")
        print(f"Saved Chroma database at {settings.CHROMA_PERSIST_DIRECTORY}")
