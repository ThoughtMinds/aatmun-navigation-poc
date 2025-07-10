from fastapi import APIRouter
from .endpoint import navigation

api_router = APIRouter()

api_router.include_router(navigation.router, prefix="/navigation", tags=["navigation"])
