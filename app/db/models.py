from sqlmodel import Field, SQLModel

# SQLModel classes
class Intent(SQLModel, table=True):
    intent_id: int | None = Field(default=None, primary_key=True)
    intent_name: str = Field(index=True, unique=True)
    description: str | None = Field(default=None)
    chroma_id: str | None = Field(default=None)

class Parameter(SQLModel, table=True):
    parameter_id: int | None = Field(default=None, primary_key=True)
    intent_id: int = Field(foreign_key="intent.intent_id")
    parameter_name: str = Field(index=True)
    parameter_type: str
    class Config:
        table_args = ({"sqlite_autoincrement": True}, {"unique": ["intent_id", "parameter_name"]})

class RequiredParameter(SQLModel, table=True):
    required_id: int | None = Field(default=None, primary_key=True)
    intent_id: int = Field(foreign_key="intent.intent_id")
    parameter_name: str
    class Config:
        table_args = ({"sqlite_autoincrement": True}, {"unique": ["intent_id", "parameter_name"]})

class Response(SQLModel, table=True):
    response_id: int | None = Field(default=None, primary_key=True)
    intent_id: int = Field(foreign_key="intent.intent_id")
    platform: str
    response_value: str
    class Config:
        table_args = ({"sqlite_autoincrement": True}, {"unique": ["intent_id", "platform"]})
