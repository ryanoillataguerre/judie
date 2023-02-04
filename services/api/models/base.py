import datetime
from sqlalchemy import Column, Integer, DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import PG_CONNECTION_STRING

Base = declarative_base()

engine = create_engine(PG_CONNECTION_STRING, encoding="utf8")

Session = sessionmaker(engine)


class BaseModel(Base):
    """BaseModel with boilerplate from which all other models derive.

    id: Integer, database generated primary key
    created_at: DateTime, when the object was created_at
    updated_at: DateTime, when the object was last updated_at
    """

    __abstract__ = True

    id = Column("id", Integer, primary_key=True)

    created_at = Column("created_at", DateTime, default=datetime.datetime.now)
    updated_at = Column("updated_at", DateTime, default=datetime.datetime.now)
