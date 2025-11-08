from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
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
    existing_graph: Optional[dict] = None  # Optional existing graph JSON object
    max_tokens: Optional[int] = 4096


class NodePlacementRequest(BaseModel):
    message: str
    new_nodes: dict  # The JSON object containing new nodes
    existing_graph: dict  # The JSON object containing the existing graph
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
    - existing_graph: Optional existing graph JSON object for context
    - max_tokens: Maximum tokens in response (optional, defaults to 4096)
    """
    try:
        # Build the user message
        user_message = request.message

        # Add existing graph as JSON in the message if provided
        if request.existing_graph:
            user_message += f"\n\n### Existing Graph:\n```json\n{json.dumps(request.existing_graph, indent=2)}\n```"

        # Call Claude API - always uses nodeGenerationInstruction.txt
        nodes_data = send_message_to_claude(
            message=user_message,
            instructions_file="nodeGenerationInstruction.txt",
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
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating nodes: {str(e)}"
        )


@app.post("/api/place-nodes")
async def place_nodes(request: NodePlacementRequest):
    """
    Place new nodes into an existing graph using Claude AI.

    Request body:
    - message: The user's query (e.g., "Place the new nodes into the existing graph structure")
    - new_nodes: JSON object containing new nodes
    - existing_graph: JSON object containing the existing graph
    - max_tokens: Maximum tokens in response (optional, defaults to 4096)
    """
    try:
        # Build the user message with new nodes and existing graph
        user_message = request.message

        # Add new nodes as JSON in the message
        user_message += f"\n\n### New Nodes:\n```json\n{json.dumps(request.new_nodes, indent=2)}\n```"

        # Add existing graph as JSON in the message
        user_message += f"\n\n### Existing Graph:\n```json\n{json.dumps(request.existing_graph, indent=2)}\n```"

        # Call Claude API - always uses nodePlacementInsturction.txt
        placement_data = send_message_to_claude(
            message=user_message,
            instructions_file="nodePlacementInsturction.txt",
            max_tokens=request.max_tokens
        )

        # Return the updated graph with placed nodes
        return {
            "success": True,
            "data": placement_data
        }

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse JSON from Claude's response: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error placing nodes: {str(e)}"
        )


# to run:
# source venv/bin/activate
# uvicorn main:app --reload --host 0.0.0.0 --port 8000
