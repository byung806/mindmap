"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Node {
  link: string;
  title: string;
  overview: string;
  topic: string;
}

interface Edge {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface MindMapProps {
  data: GraphData | null;
}

export default function MindMap({ data }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create a map for quick node lookup
    const nodeMap = new Map(data.nodes.map(node => [node.title, node]));

    // Transform data for D3
    const nodes = data.nodes.map(node => ({
      id: node.title,
      ...node
    }));

    const links = data.edges.map(edge => ({
      source: edge.source,
      target: edge.target
    }));

    // Color scale by topic
    const topics = Array.from(new Set(data.nodes.map(n => n.topic)));
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(topics);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Create container group for zoom
    const g = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Draw links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Draw nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles
    node.append("circle")
      .attr("r", 20)
      .attr("fill", (d: any) => colorScale(d.topic))
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))")
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 25);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 20);
      })
      .on("click", (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Add labels
    node.append("text")
      .text((d: any) => {
        const words = d.title.split(" ");
        return words.slice(0, 3).join(" ") + (words.length > 3 ? "..." : "");
      })
      .attr("text-anchor", "middle")
      .attr("dy", 35)
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("fill", "#334155")
      .style("pointer-events", "none")
      .style("user-select", "none");

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="relative h-[calc(100vh-73px)] w-full">
      <svg
        ref={svgRef}
        className="h-full w-full bg-gradient-to-br from-slate-50 to-white dark:from-zinc-950 dark:to-black"
      />

      {selectedNode && (
        <div className="absolute right-6 top-6 w-96 rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95">
          <div className="mb-4 flex items-start justify-between">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {selectedNode.topic}
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              ✕
            </button>
          </div>
          <h3 className="mb-3 text-lg font-semibold text-black dark:text-white">
            {selectedNode.title}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {selectedNode.overview}
          </p>
          <a
            href={selectedNode.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600 hover:shadow-lg"
          >
            Visit Resource
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      <div className="absolute bottom-6 left-6 rounded-xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95">
        <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Controls
        </p>
        <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-500">
          <div>• Drag nodes to reposition</div>
          <div>• Scroll to zoom</div>
          <div>• Click nodes for details</div>
        </div>
      </div>
    </div>
  );
}
