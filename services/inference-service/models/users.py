from logging import getLogger

from sqlalchemy import (
    Column,
    String,
)


from app.models.base import BaseModel, Session


logger = getLogger(__name__)

session = Session()


class User(BaseModel):
    """
    Class used to represent and manipulate User objects from the database
    """

    __tablename__ = "users"

    name = Column("name", String(32), nullable=False)

    def __init__(self, name: str):
        self.name = name

    def __repr__(self):
        return f"User {self.id}: {self.name}"


def create_user(name: str) -> User:
    user = User(name)
    session.add(user)
    session.commit()
    logger.info(f"Created User {user.id}: {user.name}")
    return user


def update_user(user_id: int, name: str) -> User:
    user = get_user(user_id)
    user.name = name
    session.add(user)
    session.commit()
    logger.info(f"Updated User {user.id}: {user.name}")
    return user


def get_user(user_id: str) -> User:
    return session.query(User).get(user_id)


def get_all_users() -> list[User]:
    users = session.query(User).all()
    logger.info(f"Queried {len(users)} users")
    return users
