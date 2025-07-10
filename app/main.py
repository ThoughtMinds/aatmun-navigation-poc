from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings
from app import api, db, rag
from app.middlewares.logging_middleware import LoggingMiddleware
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if not exist and insert intent data
    db.create_db_and_tables()
    # Create vector db
    rag.create_vectorstore()
    yield
    # Clean up 
    
    
server = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION, lifespan=lifespan)

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