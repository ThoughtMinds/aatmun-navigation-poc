from fastapi import APIRouter
from .endpoint import database, navigation

api_router = APIRouter()

api_router.include_router(database.router, prefix="/database", tags=["database"])
api_router.include_router(navigation.router, prefix="/navigation", tags=["navigation"])
