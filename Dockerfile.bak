FROM node:18 AS frontend
WORKDIR /app
COPY frontend/ ./frontend
RUN cd frontend && npm install && npm run build

FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app
COPY backend/ ./backend
COPY --from=frontend /app/frontend/build ./frontend/build

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
