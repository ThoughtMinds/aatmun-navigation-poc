from app import schema
from typing import List, Dict, Optional
from langchain_core.documents import Document


def parse_navigation_data(
    navigation_data: List[Dict[str, str]],
) -> Optional[List[schema.NavigationIntent]]:
    navigation_intents: List[schema.NavigationIntent] = []

    for item in navigation_data:
        try:
            intent = schema.NavigationIntent(**item)
            navigation_intents.append(intent)
        except Exception as e:
            print(e)

    return navigation_intents


def get_documents(navigation_intents: List[schema.NavigationIntent]) -> List[Document]:
    documents: List[Document] = []

    for intent in navigation_intents:
        doc = Document(page_content=intent.description, metadata={"id": intent.id})
        documents.append(doc)

    return documents
