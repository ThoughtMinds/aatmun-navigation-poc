from typing import Annotated, Dict, List, Optional
from fastapi import Depends, APIRouter, HTTPException, Query
from sqlmodel import Session, select, delete
from app import db, schema
from json import load


router = APIRouter()
SessionDep = Annotated[Session, Depends(db.get_session)]

# TODO: Ensure Create, Edit, Delete is also reflected in Chroma (use ID for search)

@router.post("/intents/", response_model=schema.IntentResponse)
def create_intent(intent: schema.IntentCreate, session: SessionDep) -> schema.IntentResponse:
    """Create a new intent with associated parameters, required parameters, and responses.

    Args:
        intent (schema.IntentCreate): The intent data including name, description, parameters, required parameters, and responses.
        session (SessionDep): The database session dependency.

    Returns:
        schema.IntentResponse: The created intent with its ID, name, description, parameters, required parameters, and responses.

    Raises:
        HTTPException: If there is a database error (e.g., unique constraint violation).
    """
    db_intent = db.Intent(intent_name=intent.intent, description=intent.description)
    session.add(db_intent)
    session.commit()
    session.refresh(db_intent)
    
    for param_name, param_type in intent.parameters.items():
        db_param = db.Parameter(intent_id=db_intent.intent_id, parameter_name=param_name, parameter_type=param_type)
        session.add(db_param)
    
    for param_name in intent.required:
        db_required = db.RequiredParameter(intent_id=db_intent.intent_id, parameter_name=param_name)
        session.add(db_required)
    
    for platform, response_value in intent.responses.items():
        db_response = db.Response(intent_id=db_intent.intent_id, platform=platform, response_value=response_value)
        session.add(db_response)
    
    session.commit()
    
    return schema.IntentResponse(
        intent_id=db_intent.intent_id,
        intent=db_intent.intent_name,
        description=db_intent.description,
        parameters=intent.parameters,
        required=intent.required,
        responses=intent.responses
    )

@router.get("/intents/{intent_id}", response_model=schema.IntentResponse)
def read_intent(intent_id: int, session: SessionDep) -> schema.IntentResponse:
    """Retrieve an intent by its ID, including its parameters, required parameters, and responses.

    Args:
        intent_id (int): The ID of the intent to retrieve.
        session (SessionDep): The database session dependency.

    Returns:
        schema.IntentResponse: The intent data including ID, name, description, parameters, required parameters, and responses.

    Raises:
        HTTPException: If the intent with the specified ID is not found (404).
    """
    intent = session.get(db.Intent, intent_id)
    if not intent:
        raise HTTPException(status_code=404, detail="Intent not found")
    
    parameters = session.exec(
        select(db.Parameter).where(db.Parameter.intent_id == intent_id)
    ).all()
    parameters_dict = {param.parameter_name: param.parameter_type for param in parameters}
    
    required_params = session.exec(
        select(db.RequiredParameter).where(db.RequiredParameter.intent_id == intent_id)
    ).all()
    required_list = [param.parameter_name for param in required_params]
    
    responses = session.exec(
        select(db.Response).where(db.Response.intent_id == intent_id)
    ).all()
    responses_dict = {resp.platform: resp.response_value for resp in responses}
    
    return schema.IntentResponse(
        intent_id=intent.intent_id,
        intent=intent.intent_name,
        description=intent.description,
        parameters=parameters_dict,
        required=required_list,
        responses=responses_dict
    )

@router.get("/intents/", response_model=List[schema.IntentResponse])
def read_intents(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[Optional[int], Query(le=100)] = None,
) -> List[schema.IntentResponse]:
    """Retrieve a paginated list of all intents with their parameters, required parameters, and responses.

    Args:
        session (SessionDep): The database session dependency.
        offset (int, optional): The number of records to skip for pagination. Defaults to 0.
        limit (Optional[int], optional): The maximum number of records to return. Defaults to None (fetch all), max 100.

    Returns:
        List[schema.IntentResponse]: A list of intents, each including ID, name, description, parameters, required parameters, and responses.
    """
    query = select(db.Intent).offset(offset)
    if limit is not None:
        query = query.limit(limit)
    intents = session.exec(query).all()
    result = []
    for intent in intents:
        parameters = session.exec(
            select(db.Parameter).where(db.Parameter.intent_id == intent.intent_id)
        ).all()
        parameters_dict = {param.parameter_name: param.parameter_type for param in parameters}
        
        required_params = session.exec(
            select(db.RequiredParameter).where(db.RequiredParameter.intent_id == intent.intent_id)
        ).all()
        required_list = [param.parameter_name for param in required_params]
        
        responses = session.exec(
            select(db.Response).where(db.Response.intent_id == intent.intent_id)
        ).all()
        responses_dict = {resp.platform: resp.response_value for resp in responses}
        
        result.append(schema.IntentResponse(
            intent_id=intent.intent_id,
            intent=intent.intent_name,
            description=intent.description,
            parameters=parameters_dict,
            required=required_list,
            responses=responses_dict
        ))
    return result

@router.delete("/intents/{intent_id}")
def delete_intent(intent_id: int, session: SessionDep) -> Dict[str, bool]:
    """Delete an intent by its ID, including its associated parameters, required parameters, and responses.

    Args:
        intent_id (int): The ID of the intent to delete.
        session (SessionDep): The database session dependency.

    Returns:
        dict: A confirmation message indicating successful deletion.

    Raises:
        HTTPException: If the intent with the specified ID is not found (404).
    """
    intent = session.get(db.Intent, intent_id)
    if not intent:
        raise HTTPException(status_code=404, detail="Intent not found")

    # TODO: Check for better way of deleting items
    
    session.exec(delete(db.Parameter).where(db.Parameter.intent_id == intent_id))
    session.exec(delete(db.RequiredParameter).where(db.RequiredParameter.intent_id == intent_id))
    session.exec(delete(db.Response).where(db.Response.intent_id == intent_id))
    
    session.delete(intent)
    session.commit()
    return {"ok": True}

@router.post("/intents/insert_example_intents")
def insert_example_intents(session: SessionDep) -> Dict:
    """Insert sample intent data into the database for testing purposes.

    Args:
        session (SessionDep): The database session dependency.

    Returns:
        dict: A confirmation message indicating successful insertion of sample data.
    """
    with open("./static/data/navigation_intents.json") as f:
        sample_data = load(f)
 
    records_inserted = 0
    for data in sample_data:
        try:
            create_intent(schema.IntentCreate(**data), session)
            records_inserted += 1
        except Exception as e:
            print(f"Failed to insert intent due to: {e}")
    return {"message": f"Inserted {records_inserted} Intents to database"}