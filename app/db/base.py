from sqlmodel import Session, SQLModel, create_engine
from .models import Intent, Parameter, RequiredParameter, Response

# Database setup
sqlite_file_name = "]./static/db/navigation_intents.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
