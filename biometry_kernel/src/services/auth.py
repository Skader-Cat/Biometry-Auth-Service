from sqlalchemy.future import select
from fastapi.responses import JSONResponse
from biometry_kernel.src.models.schemas.user import UserCreate, UserLogin
from biometry_kernel.src.database import AsyncSession
from biometry_kernel.src.services import Manager
from biometry_kernel.src.models.tables.user import User

class AuthManager(Manager):
    db = None
    broker = None
    channel = None
    
    @classmethod
    async def register(cls, user_data: UserCreate):
        stmt = select(User).where(User.email == user_data.email)
        result = await cls.db.execute(stmt)
        existing_user = result.scalars().first()
        if existing_user:
            return JSONResponse(status_code=400, content={"message": "User already exists"})
        new_user = User(email=user_data.email, username=user_data.username, image_embedding=user_data.image_embedding)
        cls.db.add(new_user)
        await cls.db.commit()
        return new_user

    @classmethod
    async def login(cls, user: UserLogin):
        stmt = select(User).where(User.email == user.email)
        result = await cls.db.execute(stmt)
        current_user = result.scalars().first()
        if current_user is None:
            raise ValueError("User not found")
        return current_user