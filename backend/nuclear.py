from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import os
import requests
import json

load_dotenv()

# --- Data Models ---


class Node(BaseModel):
    link: str
    title: str
    overview: str
    topic: str
    weight: float


class Edge(BaseModel):
    source: str
    target: str


class Graph(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    summary: str


# --- FastAPI App ---
app = FastAPI()


@app.get("/graph", response_model=Graph)
async def get_graph(
    search_term: str = Query(..., description="Topic to search for"),
    max_nodes: int = Query(100, description="Maximum number of nodes"),
    max_depth: int = Query(5, description="Maximum depth of the search")
):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500, detail="Missing OPENROUTER_API_KEY environment variable")

    # --- Step 1: Ask OpenRouter to generate the structured graph ---
    prompt = f"""
    Generate a structured learning graph for "{search_term}" with up to {max_nodes} nodes and depth {max_depth}.
    Use the following JSON schema strictly:

    {{
        "nodes": [
            {{
                "link": "https://example.com/resource",
                "title": "Descriptive title",
                "overview": "One-sentence summary of the resource",
                "topic": "Category name",
                "weight": 0.9
            }}
        ],
        "edges": [
            {{
                "source": "index of prerequisite node (string)",
                "target": "index of dependent node (string)"
            }}
        ],
        "summary": "Concise summary of what the learner gains."
    }}

    Return ONLY valid JSON. Do not include any explanations or markdown.
    """

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are an expert curriculum designer returning only valid JSON."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
            },
            timeout=60,
        )
        data = response.json()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"OpenRouter API call failed: {e}")

    # --- Step 2: Extract the model output safely ---
    try:
        content = data["choices"][0]["message"]["content"].strip()
        graph_data = json.loads(content)  # Parse the model’s JSON
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to parse model response: {e}")

    # --- Step 3: Validate and convert data types ---
    # Make sure all edge sources/targets are strings
    edges = [
        Edge(source=str(edge["source"]), target=str(edge["target"]))
        for edge in graph_data.get("edges", [])
    ]

    nodes = [Node(**n) for n in graph_data.get("nodes", [])]
    summary = graph_data.get("summary", "")

    # --- Step 4: Return the validated Graph object ---
    return Graph(nodes=nodes, edges=edges, summary=summary)
