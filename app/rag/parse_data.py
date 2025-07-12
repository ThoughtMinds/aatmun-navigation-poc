from typing import Dict, List
from langchain_core.documents import Document
from app import schema

def get_documents(navigation_intents: List[Dict]) -> List[Document]:
    documents: List[Document] = []

    for intent in navigation_intents:
        try:
            doc = Document(page_content=intent["description"])
            documents.append(doc)
        except Exception as e:
            print(f"Create document failed due to: {e}")

    return documents


def get_documents(navigation_intent: schema.IntentCreate) -> Document:
    try:
        doc = Document(page_content=navigation_intent.description)
        return doc
    except Exception as e:
        print(f"Create document failed due to: {e}")
