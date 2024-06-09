import os
from faststream.rabbit.fastapi import RabbitBroker, RabbitRouter


class BrokerManager:
    def __init__(self) -> None:
        self.RABBITMQ_URL = os.getenv('RABBITMQ_URL')
        self.router = RabbitRouter(
            self.RABBITMQ_URL,  
            schema_url="/asyncapi",
            include_in_schema=True
            )
        
    async def connect(self):
        await self.router.broker.connect()
        
Broker_Manager = BrokerManager()
        