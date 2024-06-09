from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from biometry_kernel.src.database import DB_Manager
from biometry_kernel.src.broker import Broker_Manager
from biometry_kernel.src.services import Manager
from biometry_kernel.src.services.auth import AuthManager
from faststream.rabbit.fastapi import RabbitBroker, RabbitRouter
import os

@asynccontextmanager
async def main_app_lifespan(app: FastAPI):
    
    app.state.db = {
        "engine": await DB_Manager.create_db_engine(),
        "session": await DB_Manager.get_session()
    }
    
    AuthManager.db = app.state.db['session']
    
    try:
        yield
    finally:
        async with app.state.db['session']() as session:
            await session.close()
            await Broker_Manager.router.lifespan_context(app)
            
        await app.state.db['engine'].dispose()
