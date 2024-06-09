FROM python:3.10-slim

RUN pip install --no-cache-dir poetry
RUN pip install facenet-pytorch

COPY . /app
WORKDIR /app

RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]