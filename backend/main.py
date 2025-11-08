from fastapi import FastAPI

app = FastAPI()

@app.get("/api/greeting")
async def get_greeting():
    return {"message": "Hello from FastAPI!"}



# to run:
# source venv/bin/activate
# uvicorn main:app --reload --host 0.0.0.0 --port 8000
