from langchain_core.prompts import PromptTemplate
from .base import get_ollama_chat_model, get_ollama_chat_fallback_model

RAG_PROMPT = """
You are an navigation assistant. You are given a list of navigation options with their ID.
Your task is to identify the option that is most similar to the user {query}
Query: {query}
Context: {context}
Schema:
{{

    "id": ID,
    "reasoning": <Reasoning for selecting this ID
}}
Output:
"""

rag_template = PromptTemplate.from_template(RAG_PROMPT)

llama_32_1b, llama_32_3b = get_ollama_chat_model(), get_ollama_chat_fallback_model()
chat_model = llama_32_3b.with_fallbacks([llama_32_1b])

rag_chain = rag_template | chat_model
