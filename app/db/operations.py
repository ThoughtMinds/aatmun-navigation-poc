from typing import Dict, List, Optional
from fastapi import HTTPException
from sqlmodel import Session, select, delete
from app import db, schema


def create_intent_db(intent: schema.IntentCreate, session: Session) -> schema.IntentResponse:
    """Create a new intent in the database with associated parameters, required parameters, and responses.

    Args:
        intent (schema.IntentCreate): The intent data including name, description, parameters, required parameters, and responses.
        session (Session): The database session for executing queries.

    Returns:
        schema.IntentResponse: The created intent with its ID, name, description, parameters, required parameters, and responses.

    Raises:
        HTTPException: If there is a database error (e.g., unique constraint violation).
    """
    db_intent = db.Intent(intent_name=intent.intent, description=intent.description, chroma_id=intent.chroma_id)
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

def read_intent_db(intent_id: int, session: Session) -> schema.IntentResponse:
    """Retrieve an intent from the database by its ID, including associated parameters, required parameters, and responses.

    Args:
        intent_id (int): The ID of the intent to retrieve.
        session (Session): The database session for executing queries.

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

def read_intents_db(session: Session, offset: int = 0, limit: Optional[int] = None) -> List[schema.IntentResponse]:
    """Retrieve a paginated list of all intents from the database with their parameters, required parameters, and responses.

    Args:
        session (Session): The database session for executing queries.
        offset (int, optional): The number of records to skip for pagination. Defaults to 0.
        limit (Optional[int], optional): The maximum number of records to return. Defaults to None (fetch all).

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

def delete_intent_db(intent_id: int, session: Session) -> Dict[str, bool]:
    """Delete an intent and its associated data (parameters, required parameters, responses) from the database.

    Args:
        intent_id (int): The ID of the intent to delete.
        session (Session): The database session for executing queries.

    Returns:
        Dict[str, bool]: A dictionary with a key 'ok' set to True indicating successful deletion.

    Raises:
        HTTPException: If the intent with the specified ID is not found (404).
    """
    intent = session.get(db.Intent, intent_id)
    if not intent:
        raise HTTPException(status_code=404, detail="Intent not found")

    session.exec(delete(db.Parameter).where(db.Parameter.intent_id == intent_id))
    session.exec(
        delete(db.RequiredParameter).where(db.RequiredParameter.intent_id == intent_id)
    )
    session.exec(delete(db.Response).where(db.Response.intent_id == intent_id))

    session.delete(intent)
    session.commit()
    return {"ok": True}


def count_intents_db(session: Session) -> int:
    """Retrieve the total count of intents in the database.

    Args:
        session (Session): The database session for executing queries.

    Returns:
        int: The total number of intents.
    """
    return session.query(db.Intent).count()