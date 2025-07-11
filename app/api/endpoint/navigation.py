from fastapi import APIRouter, HTTPException
from app import agent, schema


router = APIRouter()

@router.post("/get_navigation/", response_model=schema.Navigation)
def get_navigation(intent: schema.NavigationQuery) -> schema.Navigation:
    query = intent.query
    response = agent.graph.invoke({"question": query})
    navigation = response["navigation"]
    return navigation