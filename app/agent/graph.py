from typing_extensions import List, TypedDict
from langchain_core.documents import Document
from app import rag, llm, schema
from langgraph.graph import START, StateGraph


class State(TypedDict):
    question: str
    context: List[Document]
    navigation: schema.Navigation


def retrieve(state: State):
    vectorstore = rag.get_vectorstore()
    retriever = vectorstore.as_retriever()
    retrieved_docs = retriever.invoke(input=state["question"])
    return {"context": retrieved_docs}


def generate(state: State):
    context = ""
    for doc in state["context"]:
        context += f"{doc.metadata['id']} - {doc.page_content} | "
    response = llm.rag_chain.invoke({"query": state["question"], "context": context})
    return {"navigation": response}


graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()
