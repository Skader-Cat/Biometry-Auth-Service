import uuid
from biometry_kernel.src.database import Base
from sqlalchemy import UUID, Column, String
from sqlalchemy.dialects.postgresql import BYTEA as LargeBinary


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    image_embedding = Column(LargeBinary)
    