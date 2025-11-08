from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json
from nodeGenerationAgent import send_message_to_claude

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NodeGenerationRequest(BaseModel):
    message: str
    instructions_file: Optional[str] = "nodeGenerationInstruction.txt"
    additional_files: Optional[List[str]] = ["sampleGraph1.json"]
    max_tokens: Optional[int] = 4096


@app.get("/api/greeting")
async def get_greeting():
    return {"message": "Hello from FastAPI!"}


@app.post("/api/generate-nodes")
async def generate_nodes(request: NodeGenerationRequest):
    """
    Generate mind map nodes using Claude AI.

    Request body:
    - message: The user's query (e.g., "Break down React Hooks into subtopics")
    - instructions_file: Path to instruction file (optional, defaults to nodeGenerationInstruction.txt)
    - additional_files: List of additional context files (optional, defaults to [sampleGraph1.json])
    - max_tokens: Maximum tokens in response (optional, defaults to 4096)
    """
    try:
        # Call Claude API - now returns parsed JSON directly
        nodes_data = send_message_to_claude(
            message=request.message,
            instructions_file=request.instructions_file,
            additional_files=request.additional_files,
            max_tokens=request.max_tokens
        )

        # Return the parsed nodes
        return {
            "success": True,
            "data": nodes_data
        }

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse JSON from Claude's response: {str(e)}"
        )
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"File not found: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating nodes: {str(e)}"
        )


# to run:
# source venv/bin/activate
# uvicorn main:app --reload --host 0.0.0.0 --port 8000
