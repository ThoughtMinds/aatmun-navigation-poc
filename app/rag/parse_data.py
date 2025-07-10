from app import schema
from typing import List
from langchain_core.documents import Document


def get_documents(navigation_intents: List[schema.IntentResponse]) -> List[Document]:
    documents: List[Document] = []

    for intent in navigation_intents:
        doc = Document(
            page_content=intent.description, metadata={"id": intent.intent_id}
        )
        documents.append(doc)

    return documents
