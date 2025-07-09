FROM python:3.11-slim

WORKDIR /code

COPY requirements.txt . 

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY static ./static

EXPOSE 8000

CMD ["uvicorn", "app.main:server", "--host", "0.0.0.0", "--port", "8000", "--reload"]