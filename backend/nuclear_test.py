import requests
import json
from pprint import pprint

# -------------------------------------------------
# CONFIGURATION
# -------------------------------------------------
BASE_URL = "http://127.0.0.1:8000"  # Change if deployed
TEST_TOPIC = "nuclear energy"
MAX_NODES = 15
MAX_DEPTH = 6


# -------------------------------------------------
# HELPER FUNCTIONS
# -------------------------------------------------
def print_summary(graph_data):
    print("\n--- SUMMARY ---")
    summary = graph_data.get("summary", {})
    pprint(summary)

    nodes = graph_data.get("nodes", [])
    print(f"\nTotal Nodes: {len(nodes)}")
    print("Sample Nodes:")
    for n in nodes[:3]:
        print(f"  - {n['title']} ({n['topic']}, weight={n['weight']})")

    edges = graph_data.get("edges", [])
    print(f"\nTotal Edges: {len(edges)}")
    print("Sample Edges:")
    for e in edges[:3]:
        print(f"  - {e['source']} → {e['target']}")


def validate_graph_structure(graph_data):
    """Basic schema validation for the learning graph output."""
    assert "nodes" in graph_data, "Missing 'nodes' field"
    assert "edges" in graph_data, "Missing 'edges' field"
    assert "summary" in graph_data, "Missing 'summary' field"

    for node in graph_data["nodes"]:
        for field in ["link", "title", "overview", "topic", "weight"]:
            assert field in node, f"Missing '{field}' in node"

    for edge in graph_data["edges"]:
        for field in ["source", "target"]:
            assert field in edge, f"Missing '{field}' in edge"

    print("\n✅ Structure validation passed!")


# -------------------------------------------------
# MAIN TEST
# -------------------------------------------------
def test_graph_api():
    print(f"Testing /graph endpoint for topic: '{TEST_TOPIC}'")
    url = f"{BASE_URL}/graph"
    params = {"search_term": TEST_TOPIC,
              "max_nodes": MAX_NODES, "max_depth": MAX_DEPTH}

    try:
        resp = requests.get(url, params=params, timeout=120)
        resp.raise_for_status()
        data = resp.json()

        # Handle error responses
        if "error" in data:
            print("❌ API returned an error:")
            pprint(data)
            return

        # Validate and print summary
        validate_graph_structure(data)
        print_summary(data)

        # -------------------------------------------------
        # PRINT FULL GRAPH JSON
        # -------------------------------------------------
        print("\n--- FULL GRAPH JSON ---")
        print(json.dumps(data, indent=2))

    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except AssertionError as e:
        print(f"❌ Validation failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    test_graph_api()
