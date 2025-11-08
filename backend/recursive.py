from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Set, Dict, Any
from dotenv import load_dotenv
import os
import requests
import json
import asyncio
import time

# -------------------------------------------------
# SETUP
# -------------------------------------------------
load_dotenv()
app = FastAPI(title="Recursive Graph Generator API")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = os.getenv("OPENROUTER_API_KEY")

# -------------------------------------------------
# MODELS
# -------------------------------------------------


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


# -------------------------------------------------
# HELPER — single segment generation
# -------------------------------------------------
async def generate_graph_segment(topic: str, per_call_limit: int = 5) -> Dict[str, Any]:
    """Fetch one subgraph from OpenRouter for a given topic."""
    prompt = f"""
    Generate up to {per_call_limit} related learning resources for the topic "{topic}".
    Use this JSON schema only:
    {{
      "nodes": [
        {{
          "link": "https://example.com",
          "title": "Descriptive title",
          "overview": "One-sentence summary",
          "topic": "Category name",
          "weight": 0.8
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
    Return ONLY valid JSON. No markdown or commentary.
    """

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        resp = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json={
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system",
                        "content": "You are a curriculum generator returning strict JSON."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
            },
            timeout=40,
        )
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]
        return json.loads(content)
    except Exception as e:
        print(f"[ERROR] Graph segment generation failed: {e}")
        return {"nodes": [], "edges": [], "summary": f"Error: {e}"}


# -------------------------------------------------
# CORE — recursive generator with total node cap
# -------------------------------------------------
async def recursive_graph(
    root_topic: str,
    max_nodes: int,
    max_depth: int,
    timeout: int = 90,
    send_partial: bool = False
):
    start_time = time.time()
    visited: Set[str] = set()
    all_nodes: List[Node] = []
    all_edges: List[Edge] = []
    summaries: List[str] = []

    async def expand(topic: str, depth: int = 0):
        nonlocal all_nodes, all_edges, summaries

        # Timeout and recursion limits
        if time.time() - start_time > timeout:
            raise TimeoutError("Graph generation timeout exceeded.")
        if depth >= max_depth or len(all_nodes) >= max_nodes or topic in visited:
            return
        visited.add(topic)

        # Request a small batch of related nodes
        segment = await generate_graph_segment(topic)
        summaries.append(segment.get("summary", ""))

        new_nodes = [Node(**n) for n in segment.get("nodes", [])]
        new_edges = [Edge(source=str(e["source"]), target=str(e["target"]))
                     for e in segment.get("edges", [])]

        for node in new_nodes:
            if len(all_nodes) >= max_nodes:
                break
            if node.title not in {n.title for n in all_nodes}:
                all_nodes.append(node)
                # Send partial update *immediately* after each node
                if send_partial:
                    yield json.dumps({
                        "nodes": [n.dict() for n in all_nodes],
                        "edges": [e.dict() for e in all_edges],
                        "summary": f"Added node '{node.title}' at depth {depth}"
                    }) + "\n"

        # Add edges after nodes are confirmed
        all_edges.extend(new_edges)

        # Recursively expand only if under limits
        for node in new_nodes[:3]:
            if len(all_nodes) >= max_nodes:
                break
            async for chunk in expand(node.title, depth + 1):
                yield chunk

    try:
        async for chunk in expand(root_topic):
            if send_partial:
                yield chunk
    except TimeoutError as e:
        yield json.dumps({"error": str(e)}) + "\n"

    # Final summary if batch mode
    if not send_partial:
        yield json.dumps({
            "nodes": [n.dict() for n in all_nodes],
            "edges": [e.dict() for e in all_edges],
            "summary": " ".join(summaries)
        })


# -------------------------------------------------
# ROUTE
# -------------------------------------------------
@app.get("/graph")
async def get_graph(
    search_term: str = Query(...),
    max_nodes: int = Query(15, description="Total max number of nodes"),
    max_depth: int = Query(3, description="Recursion depth"),
    stream: bool = Query(
        False, description="Stream partial updates as they are generated"),
):
    if not API_KEY:
        raise HTTPException(
            status_code=500, detail="Missing OPENROUTER_API_KEY environment variable")

    generator = recursive_graph(
        search_term, max_nodes, max_depth, timeout=90, send_partial=stream)

    if stream:
        return StreamingResponse(generator, media_type="application/json")
    else:
        data = [chunk async for chunk in generator]
        return JSONResponse(content=json.loads(data[-1]))
