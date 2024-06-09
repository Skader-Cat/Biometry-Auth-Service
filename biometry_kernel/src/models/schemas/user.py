from uuid import UUID
from fastapi import File, UploadFile
from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    username: str
    image_embedding: bytes
    
class UserLogin(BaseModel):
    email: str
    image_embedding: bytes
        
class User(BaseModel):
    id: UUID | None = None
    email: str
    username: str
    image_embedding: bytes
    
    class Config:
        orm_mode = True