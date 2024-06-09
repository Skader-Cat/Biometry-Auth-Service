from fastapi import FastAPI, File, Request, UploadFile
import fastapi
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import JSONResponse
from faststream.rabbit.fastapi import RabbitBroker, RabbitRouter
import os


app = FastAPI()

router = RabbitRouter(os.getenv('RABBITMQ_URL'))

app.include_router(router, tags=["broker"])

@router.subscriber("test_in")
async def test(msg_data: str):
    router.broker.logger.info(f"Received message: {msg_data}")
    print(f"Received message: {msg_data}")
    fastapi.logger.info(f"Received message: {msg_data}")
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
