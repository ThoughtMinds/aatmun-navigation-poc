from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app import agent, db, schema
import pandas as pd
from typing import Annotated, List
from sqlmodel import Session
from time import time


router = APIRouter()
SessionDep = Annotated[Session, Depends(db.get_session)]


@router.post("/get_navigation/", response_model=schema.NavigationResponse)
def get_navigation(
    intent: schema.NavigationQuery, session: SessionDep
) -> schema.Navigation:
    query = intent.query
    print(f"Request: {query}")
    response = agent.graph.invoke({"question": query})
    print(f"Response: {response}")
    navigation: schema.Navigation = response["navigation"]

    predicted_intent = db.get_intent_name_by_chroma_id_db(
        chroma_id=navigation.id, session=session
    )
    navigation_response = schema.NavigationResponse(
        id=navigation.id, reasoning=navigation.reasoning, intent_name=predicted_intent
    )
    return navigation_response


@router.post("/test_navigation/", response_model=List[schema.NavigationTestResult])
async def upload_navigation_excel(
    session: SessionDep,
    file: UploadFile = File(...),
) -> List[schema.NavigationTestResult]:
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(
            status_code=400, detail="Only Excel files (.xlsx, .xls) are supported"
        )

    try:
        df = pd.read_excel(file.file)

        if "Query" not in df.columns:
            raise HTTPException(
                status_code=400, detail="Excel file must contain a 'Query' column"
            )

        navigation_results = []

        for _, row in df.iterrows():
            try:
                print(f"Testing Query #{_}")
                query, actual_intent = row["Query"], row["Intent"]

                if not query or not isinstance(query, str):
                    continue

                start_time = time()
                response = agent.graph.invoke({"question": query})
                end_time = time()

                elapsed_time = end_time - start_time
                elapsed_time = round(elapsed_time, 3)
                print(f"Time taken: {elapsed_time:.4f} seconds")

                navigation: schema.Navigation = response["navigation"]
                chroma_id = navigation.id

                predicted_intent = db.get_intent_name_by_chroma_id_db(
                    chroma_id=chroma_id, session=session
                )

                result = schema.NavigationTestResult(
                    query=query,
                    actual_intent=actual_intent,
                    predicted_intent=predicted_intent,
                    response_time=elapsed_time,
                )

                print(f"Result: {result}")
                navigation_results.append(result)
                # Measure accuracy, add score
            except Exception as e:
                print(f"Failed to process test due to: {e}")

        if not navigation_results:
            raise HTTPException(
                status_code=400, detail="No valid queries found in the Excel file"
            )

        return navigation_results

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing Excel file: {str(e)}"
        )
