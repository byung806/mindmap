import requests
import json
import time
from pprint import pprint

# -------------------------------------------------
# CONFIGURATION
# -------------------------------------------------
BASE_URL = "http://127.0.0.1:8000"
SEARCH_TERM = "nuclear energy"
MAX_NODES = 10
MAX_DEPTH = 3
STREAM_MODE = True

# -------------------------------------------------
# MAIN TEST FUNCTION
# -------------------------------------------------


def test_recursive_graph():
    mode = "streaming" if STREAM_MODE else "batch"
    print(f"\n🚀 Testing /graph endpoint in {mode} mode for '{SEARCH_TERM}'")

    params = {
        "search_term": SEARCH_TERM,
        "max_nodes": MAX_NODES,
        "max_depth": MAX_DEPTH,
        "stream": STREAM_MODE
    }

    start = time.time()
    url = f"{BASE_URL}/graph"
    all_nodes = []
    all_edges = []
    final_summary = ""

    try:
        if STREAM_MODE:
            # --- STREAMING MODE ---
            with requests.get(url, params=params, stream=True, timeout=300) as resp:
                resp.raise_for_status()
                print("\n--- STREAMING OUTPUT ---")

                for line in resp.iter_lines(decode_unicode=True):
                    if not line.strip():
                        continue

                    try:
                        data = json.loads(line)
                    except json.JSONDecodeError:
                        print("⚠️ Invalid JSON chunk:", line)
                        continue

                    nodes = data.get("nodes", [])
                    edges = data.get("edges", [])
                    summary = data.get("summary", "")

                    all_nodes = nodes
                    all_edges = edges
                    final_summary = summary

                    print(
                        f"\n🧩 Partial update ({len(nodes)} nodes, {len(edges)} edges):")
                    print(f"Summary: {summary}")

            # --- After streaming completes ---
            print("\n📦 FINAL GRAPH SUMMARY ---")
            print(f"Total Nodes: {len(all_nodes)}")
            print(f"Total Edges: {len(all_edges)}")
            print(f"\nFinal Summary:\n{final_summary}")

            print("\n--- Sample Nodes ---")
            for n in all_nodes[:5]:
                print(f"  - {n['title']} ({n['topic']}, weight={n['weight']})")

            print("\n--- Sample Edges ---")
            for e in all_edges[:5]:
                print(f"  {e['source']} → {e['target']}")

            print("\n--- FULL GRAPH JSON ---")
            print(json.dumps({
                "nodes": all_nodes,
                "edges": all_edges,
                "summary": final_summary
            }, indent=2))

        else:
            # --- BATCH MODE ---
            resp = requests.get(url, params=params, timeout=180)
            resp.raise_for_status()
            data = resp.json()

            all_nodes = data.get("nodes", [])
            all_edges = data.get("edges", [])
            final_summary = data.get("summary", "")

            print("\n✅ Received full graph!")
            print(f"Total Nodes: {len(all_nodes)}")
            print(f"Total Edges: {len(all_edges)}")
            print("\nSummary:\n", final_summary)

            print("\n--- Sample Nodes ---")
            for n in all_nodes[:5]:
                print(f"  - {n['title']} ({n['topic']}, weight={n['weight']})")

            print("\n--- FULL GRAPH JSON ---")
            print(json.dumps(data, indent=2))

    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except KeyboardInterrupt:
        print("⛔ Interrupted by user.")
    finally:
        duration = time.time() - start
        print(f"\n⏱️  Total test duration: {duration:.2f}s")


# -------------------------------------------------
# ENTRY POINT
# -------------------------------------------------
if __name__ == "__main__":
    test_recursive_graph()
