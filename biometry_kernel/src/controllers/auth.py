import io
from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from fastapi.responses import JSONResponse
from biometry_kernel.src.models.schemas.user import UserCreate, UserLogin

from biometry_kernel.src.services import auth
from sqlalchemy.orm import Session
from PIL import Image


auth_router = APIRouter()

@auth_router.post("/register")
async def register(image: UploadFile = File(...), email: str = Form(...), username: str = Form(...)):
    content = await image.read()
    try:
        #embedding = await face_recognition.get_image_embedding(io.BytesIO(content))
        #будет заменено на отправку в ML сервис через брокер очередей. Пока что функционал перенесен в face_recognition_service
        pass
    except ValueError:
        return JSONResponse(status_code=400, content={"message": "Лица на изображении не обнаружены"})
    
    await auth.AuthManager.register(UserCreate(email=email, username=username, image_embedding=embedding.tobytes()))
    return {"message": "Пользователь успешно зарегистрирован", "data": email}


@auth_router.post("/login")
async def login(image: UploadFile = File(...), email: str = Form(...)):
    content = await image.read()
    
    try:
        #embedding = await face_recognition.get_image_embedding(io.BytesIO(content))
        #будет заменено на отправку в ML сервис через брокер очередей. Пока что функционал перенесен в face_recognition_service
        pass
    except ValueError:
        return JSONResponse(status_code=401, content={"message": "Нет лиц на изображении"})
    
    try:
        user = await auth.AuthManager.login(UserLogin(email=email, image_embedding=embedding.tobytes()))
    except ValueError:
        return JSONResponse(status_code=402, content={"message": "Пользователь с таким Email не обнаружен"})
    
    if user and await face_recognition.validate_image_embedding(user.image_embedding, embedding.tobytes()):
        return {"message": "Пользователь вошёл успешно!", "data": email, "username": user.username}
    else:
        return JSONResponse(status_code=403, content={"message": "Лицо не распознано"})