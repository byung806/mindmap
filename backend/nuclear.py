from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List, Dict, Any
import httpx
import os
import json

# -------------------------------------------------
# CONFIGURATION
# -------------------------------------------------
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-4o"   # or another OpenRouter model

app = FastAPI(title="Learning Graph Generator", version="1.3")


# -------------------------------------------------
# DATA MODELS
# -------------------------------------------------
class Node(BaseModel):
    link: str
    title: str
    overview: str
    topic: str
    weight: float  # How broad the concept is (higher = more general)


class Edge(BaseModel):
    source: str
    target: str


class Graph(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    summary: Dict[str, Any]


# -------------------------------------------------
# PROMPT TEMPLATE
# -------------------------------------------------
PROMPT_TEMPLATE = """Generate a structured learning graph for {topic} that enables efficient, in-depth learning.

### Schema
class Node:
 - link: str                # Direct URL to a high-quality resource (article, video, paper, or documentation)
 - title: str               # Descriptive title of the resource
 - overview: str            # One-sentence summary of what the learner gains from this resource
 - topic: str               # Category or subfield grouping related nodes (e.g., "Fundamentals", "Applications")
 - weight: float            # How broad this topic is (1.0 = very specific/narrow, 10.0 = very broad/general)

class Edge:
 - source: Node             # Prerequisite or foundational concept
 - target: Node             # Dependent or advanced concept

### Output Format
Graph {{
  nodes: [ ... ],
  edges: [ ... ]
}}

### Generation Guidelines
1. Include up to **{max_nodes} nodes** representing the most essential and related topics for learning {topic}.
2. Limit graph complexity to **max depth {max_depth}**.
3. Assign a **weight** to each node representing *breadth*:
   - Broad foundational topics → high weight (8–10)
   - Intermediate topics → medium weight (4–7)
   - Narrow or specific subtopics → low weight (1–3)
4. Order nodes hierarchically: general → intermediate → specific → applied.
5. Favor **authoritative sources** (official docs, scholarly articles, reputable tutorials).
6. Include **cross-topic and bidirectional edges** where relevant.
7. Return a concise **summary** including:
   - total_nodes
   - total_edges
   - max_depth
   - average_weight
   - brief description of structure
8. Output must be **pure JSON**, no commentary or markdown.
"""


# -------------------------------------------------
# GRAPH GENERATION ENDPOINT
# -------------------------------------------------
@app.get("/graph", response_model=Graph)
async def generate_graph(
    search_term: str = Query(...,
                             description="Topic to generate the learning graph for"),
    max_nodes: int = Query(
        25, le=100, description="Maximum number of nodes (default 25, max 100)"),
    max_depth: int = Query(
        6, le=20, description="Maximum depth of the graph (default 6, max 20)")
):
    """
    Calls OpenRouter to generate a structured learning graph for the given topic,
    where each node has a weight representing conceptual breadth.
    """

    if not OPENROUTER_API_KEY:
        return {"error": "Missing OPENROUTER_API_KEY environment variable"}

    prompt = PROMPT_TEMPLATE.format(
        topic=search_term, max_nodes=max_nodes, max_depth=max_depth)

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a precise knowledge-graph generator that outputs valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(OPENROUTER_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    # Extract and parse model output
    text_output = data["choices"][0]["message"]["content"].strip()

    try:
        cleaned = text_output.strip("`").replace("json", "").strip()
        graph_json = json.loads(cleaned)
        return graph_json
    except Exception as e:
        return {"error": "Failed to parse model output", "details": str(e), "raw_output": text_output}


# -------------------------------------------------
# ROOT ENDPOINT
# -------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "Welcome to the Learning Graph API.",
        "usage": "GET /graph?search_term=nuclear%20energy&max_nodes=25&max_depth=6",
        "weight_definition": "Higher weight = broader/more general concept."
    }
