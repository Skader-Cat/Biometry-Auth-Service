import asyncio
import io
from typing_extensions import Annotated
from fastapi import Depends, FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import JSONResponse
from PIL import Image
from biometry_kernel.src.broker import Broker_Manager
from biometry_kernel.src.controllers import auth_router
from biometry_kernel.src.lifespan import main_app_lifespan
from faststream.rabbit.fastapi import RabbitBroker, RabbitRouter


app = FastAPI(lifespan = main_app_lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

router = Broker_Manager.router

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(router, tags=["broker"])


def broker():
    return router.broker

@app.post("/test", response_model=None)
async def test(msg_data: str, broker: Annotated[RabbitBroker, Depends(broker)]):
    await broker.connect()
    await broker.publish(msg_data, "test_in")
    broker.logger.info(f"Sent message: {msg_data}")
    return {"message": msg_data}

    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
