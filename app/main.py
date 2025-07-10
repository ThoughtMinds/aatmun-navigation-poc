from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import api_router
from app.middlewares.logging_middleware import LoggingMiddleware


server = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Logging Middleware
server.add_middleware(LoggingMiddleware)

server.include_router(api.api_router, prefix="/api")

@server.get("/")
def index():
    return {
        "version": settings.VERSION
    }