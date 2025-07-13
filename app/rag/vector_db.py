from app.core.config import settings
from langchain_chroma import Chroma
from app import llm
from .parse_data import get_documents
from .load_data import load_sample_navigation_data
from app import db, schema
from sqlmodel import Session


embeddings = llm.get_ollama_embeddings_model()


def get_vectorstore() -> Chroma:
    """Loads Chroma database

    Returns:
        Chroma: A Chroma instance
    """
    try:
        vectordb = Chroma(
            persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
            embedding_function=embeddings,
            collection_name="Navigation_Collection",
        )
    except Exception as e:
        print(f"Failed to load Chroma due to: {e}")
        raise Exception(f"Could not load Chroma!")
    return vectordb


def ensure_vectorstore_exists() -> None:
    """Create Chroma database if not exists"""
    try:
        vectorstore = Chroma(
            persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
            embedding_function=embeddings,
            collection_name="Navigation_Collection",
        )
        document_count = len(vectorstore.get()["documents"])
        assert document_count != 0
        print(
            f"Chroma database loaded from {settings.CHROMA_PERSIST_DIRECTORY} with {document_count} documents"
        )
    except Exception as e:
        print(
            f"Could not load Chroma database from {settings.CHROMA_PERSIST_DIRECTORY} {e}"
        )
        create_vector_store()


def create_vector_store() -> None:
    print("Creating Chroma database")
    sample_navigation_intents = load_sample_navigation_data()
    if len(sample_navigation_intents) == 0:
        print("No navigation data was loaded, databases will be empty!")
        return

    print(f"Creating documents for {len(sample_navigation_intents)} Intents")
    documents = get_documents(navigation_intents=sample_navigation_intents)
    print(f"Creatied {len(documents)} Documents")

    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
        collection_name="Navigation_Collection",
    )
    print(f"Saved Chroma database at {settings.CHROMA_PERSIST_DIRECTORY}")

    chroma_ids = vectorstore.get()["ids"]
    for intent, chroma_id in zip(sample_navigation_intents, chroma_ids):
        intent["chroma_id"] = chroma_id

    session = Session(db.engine)

    insert_count = 0
    for intent in sample_navigation_intents:
        try:
            intent = schema.IntentCreate(**intent)
            db.create_intent_db(session=session, intent=intent)
            insert_count += 1
        except Exception as e:
            print(f"Failed to insert Intent due to: {e}")

    print(f"Added {insert_count} Intents to Database")


def insert_intent(intent: schema.IntentCreate) -> str:
    document = get_documents(navigation_intent=intent)
    vectorstore = Chroma.from_documents(
        documents=[document],
        embedding=embeddings,
        persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
        collection_name="Navigation_Collection",
    )
    print(f"Added Document to Chroma database")
    chroma_id = vectorstore.get()["ids"][-1]
    return chroma_id


def delete_intent(chroma_id: str):
    vectorstore = Chroma(
        persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
        embedding_function=embeddings,
        collection_name="Navigation_Collection",
    )
    vectorstore.delete(ids=[chroma_id])
    print(f"Deleted document with Chroma ID: {chroma_id}")
