from fastapi import APIRouter, HTTPException, UploadFile, File
from app import agent, schema
import pandas as pd
from typing import List

router = APIRouter()

@router.post("/get_navigation/", response_model=schema.Navigation)
def get_navigation(intent: schema.NavigationQuery) -> schema.Navigation:
    query = intent.query
    response = agent.graph.invoke({"question": query})
    navigation = response["navigation"]
    return navigation


@router.post("/test_naivgation/", response_model=List[schema.Navigation])
async def upload_navigation_excel(file: UploadFile = File(...)) -> List[schema.Navigation]:
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Only Excel files (.xlsx, .xls) are supported")
    
    try:
        df = pd.read_excel(file.file)
        
        if "Query" not in df.columns:
            raise HTTPException(status_code=400, detail="Excel file must contain a 'Query' column")
        
        navigation_results = []
        for query in df["Query"]:
            # Iterate over Query, expected_navigation
            if not query or not isinstance(query, str):
                continue
            response = agent.graph.invoke({"question": query})
            navigation: schema.Navigation = response["navigation"]
            navigation_id = navigation.id
            # Fetch navigation intent by ID, check if it matches expected navigation intent
        
        if not navigation_results:
            raise HTTPException(status_code=400, detail="No valid queries found in the Excel file")
        
        return navigation_results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing Excel file: {str(e)}")