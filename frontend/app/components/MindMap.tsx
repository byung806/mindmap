"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Node {
  link: string;
  title: string;
  overview: string;
  topic: string;
  size?: number;
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

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  link: string;
  title: string;
  overview: string;
  topic: string;
  size: number;
  radius: number;
}

export default function MindMap({ data }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<D3Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Assign size values based on topic importance (you can customize this logic)
    const sizeMap: Record<string, number> = {
      Fundamentals: 3,
      Mechanics: 2,
      Competitive: 2,
      "Advanced Mechanics": 2,
      Tools: 1,
      "Alternate Format": 1,
      Lore: 1,
      Generations: 1,
    };

    // Transform data for D3 with size-based radius and initial positions
    const nodes: D3Node[] = data.nodes.map((node, i) => {
      const size = node.size || sizeMap[node.topic] || 1;
      const radius = size === 3 ? 28 : size === 2 ? 20 : 14;
      
      // Give nodes random initial positions spread across the canvas
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      const distance = Math.random() * 200 + 100;
      
      return {
        id: node.title,
        ...node,
        size,
        radius,
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
      };
    });

    const links = data.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    }));

    // Create defs for gradients and filters
    const defs = svg.append("defs");

    // Radial gradient for nodes
    const gradient = defs
      .append("radialGradient")
      .attr("id", "nodeGradient")
      .attr("cx", "40%")
      .attr("cy", "40%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(255, 255, 255, 0.95)");
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(200, 220, 255, 0.6)");

    // Glow filter
    const glowFilter = defs.append("filter").attr("id", "glow");
    glowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Strong glow for hover
    const strongGlowFilter = defs.append("filter").attr("id", "strongGlow");
    strongGlowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "6")
      .attr("result", "coloredBlur");
    const feMerge2 = strongGlowFilter.append("feMerge");
    feMerge2.append("feMergeNode").attr("in", "coloredBlur");
    feMerge2.append("feMergeNode").attr("in", "SourceGraphic");

    // Create force simulation with gentler forces
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(180)
          .strength(0.3)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.radius + 50)
      )
      .alphaDecay(0.015)
      .velocityDecay(0.4);

    // Create container group for zoom
    const g = svg.append("g");

    // Add zoom behavior with limited zoom out
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3]) // Limit zoom out to 0.5x (was 0.2x)
      .duration(300)
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        
        // Make only labels scale-invariant (fixed screen size)
        const scale = event.transform.k;
        const inverseScale = 1 / scale;
        
        // Keep labels at constant screen size
        node.selectAll(".label").attr("transform", `scale(${inverseScale})`);
      });

    svg.call(zoom);

    // Draw links with animation
    const linkGroup = g.append("g").attr("class", "links");

    const link = linkGroup
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(150, 180, 220, 0.35)")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0)
      .style("pointer-events", "none");

    // Animate links in - slower to match node timing
    link
      .transition()
      .delay((d, i) => i * 60)
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("stroke-opacity", 1);

    // Draw nodes
    const nodeGroup = g.append("g").attr("class", "nodes");

    const node = nodeGroup
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .style("opacity", 0);

    // Drag functionality removed - nodes are not draggable

    // Add outer glow circle
    node
      .append("circle")
      .attr("class", "glow")
      .attr("r", (d) => d.radius + 8)
      .attr("fill", (d) =>
        d.size === 3
          ? "rgba(180, 200, 255, 0.3)"
          : d.size === 2
            ? "rgba(160, 190, 240, 0.2)"
            : "rgba(140, 170, 220, 0.15)"
      )
      .attr("filter", "url(#glow)");

    // Add main circle
    node
      .append("circle")
      .attr("class", "main")
      .attr("r", (d) => d.radius)
      .attr("fill", "url(#nodeGradient)")
      .attr("filter", "url(#glow)");

    // Add link icon (arrow diagonal up-right) - centered in node, bigger size
    node
      .append("g")
      .attr("class", "link-icon")
      .attr("opacity", 0)
      .attr("transform", "translate(-8, -8)")
      .append("path")
      .attr("d", "M2 2L14 2L14 14M2 14L14 2")
      .attr("stroke", "rgba(0, 0, 0, 0.9)")
      .attr("stroke-width", "3")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("fill", "none")
      .style("pointer-events", "none");

    // Add labels with text wrapping
    node.each(function (d) {
      const nodeGroup = d3.select(this);
      const maxWidth = d.radius * 3; // Max width for text wrapping
      const lineHeight = d.size === 3 ? 14 : 12;
      const fontSize = d.size === 3 ? 13 : 11;
      const maxLines = 2;

      // Split text into words
      const words = d.title.split(/\s+/);
      const lines: string[] = [];
      let currentLine = "";

      // Create temporary text element to measure width
      const tempText = nodeGroup
        .append("text")
        .attr("font-size", `${fontSize}px`)
        .attr("font-weight", "300")
        .style("font-family", "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif")
        .style("visibility", "hidden");

      // Build lines that fit within maxWidth
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
        tempText.text(testLine);
        const testWidth = (tempText.node() as SVGTextElement).getComputedTextLength();

        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = words[i];
          if (lines.length >= maxLines) break;
        } else {
          currentLine = testLine;
        }
      }

      // Add remaining text
      if (currentLine && lines.length < maxLines) {
        lines.push(currentLine);
      }

      // If we have more text, add ellipsis
      if (lines.length === maxLines && words.length > lines.join(" ").split(" ").length) {
        lines[lines.length - 1] = lines[lines.length - 1] + "...";
      }

      tempText.remove();

      // Create text group
      const textGroup = nodeGroup
        .append("g")
        .attr("class", "label")
        .attr("opacity", 1)
        .style("pointer-events", "none")
        .style("user-select", "none");

      // Add each line
      lines.forEach((line, i) => {
        textGroup
          .append("text")
          .attr("text-anchor", "middle")
          .attr("y", d.radius + 18 + i * lineHeight)
          .attr("font-size", `${fontSize}px`)
          .attr("font-weight", "300")
          .attr("fill", "rgba(255, 255, 255, 0.85)")
          .style("font-family", "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif")
          .text(line);
      });
    });

    // Start simulation with all nodes but fade them in progressively
    simulation.alpha(0.5).restart();

    // Animate nodes in with staggered timing
    node
      .transition()
      .delay((d, i) => i * 150)
      .duration(600)
      .ease(d3.easeCubicOut)
      .style("opacity", 1)
      .on("start", function(d, i) {
        // Give simulation a gentle boost when each node appears
        if (i > 0) {
          simulation.alpha(Math.min(simulation.alpha() + 0.05, 0.5));
        }
      });

    // Hover interactions
    node
      .on("mouseenter", function (event, d) {
        setHoveredNode(d.id);

        const currentNode = d3.select(this);

        // Scale up and enhance glow - node stays under cursor
        currentNode
          .select(".main")
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("r", d.radius * 1.2)
          .attr("filter", "url(#strongGlow)");

        currentNode
          .select(".glow")
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("r", (d.radius + 8) * 1.2)
          .attr("fill", "rgba(200, 220, 255, 0.5)");

        // Show link icon
        currentNode
          .select(".link-icon")
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("opacity", 1);

        // Create website tag above node
        const websiteTag = currentNode
          .append("g")
          .attr("class", "website-tag")
          .attr("opacity", 0);

        // Extract domain from URL
        let domain = "";
        try {
          const url = new URL(d.link);
          domain = url.hostname.replace("www.", "");
        } catch {
          domain = d.link;
        }

        // Tag background
        const tagText = websiteTag
          .append("text")
          .attr("font-size", "10px")
          .attr("font-weight", "500")
          .attr("fill", "rgba(100, 150, 255, 1)")
          .style("font-family", "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif")
          .text(domain);

        const tagBBox = (tagText.node() as SVGTextElement).getBBox();
        const tagPadding = 6;

        websiteTag
          .insert("rect", "text")
          .attr("x", tagBBox.x - tagPadding)
          .attr("y", tagBBox.y - tagPadding)
          .attr("width", tagBBox.width + tagPadding * 2)
          .attr("height", tagBBox.height + tagPadding * 2)
          .attr("rx", 6)
          .attr("ry", 6)
          .attr("fill", "rgba(100, 150, 255, 0.15)")
          .attr("stroke", "rgba(100, 150, 255, 0.4)")
          .attr("stroke-width", 1);

        // Position tag above node
        websiteTag.attr("transform", `translate(${-tagBBox.width / 2}, ${-d.radius - 20})`);

        // Animate tag in
        websiteTag
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("opacity", 1);

        // Create hover tooltip with description
        const tooltip = currentNode
          .append("g")
          .attr("class", "hover-tooltip")
          .attr("opacity", 0);

        // Tooltip background
        const tooltipBg = tooltip
          .append("rect")
          .attr("rx", 8)
          .attr("ry", 8)
          .attr("fill", "rgba(20, 25, 35, 0.95)")
          .attr("stroke", "rgba(255, 255, 255, 0.15)")
          .attr("stroke-width", 1)
          .style("filter", "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))");

        // Tooltip text
        const tooltipText = tooltip
          .append("text")
          .attr("font-size", "11px")
          .attr("font-weight", "300")
          .attr("fill", "rgba(255, 255, 255, 0.9)")
          .style("font-family", "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif")
          .style("pointer-events", "none");

        // Wrap tooltip text
        const maxTooltipWidth = 200;
        const words = d.overview.split(/\s+/);
        const lines: string[] = [];
        let currentLine = "";

        const tempText = tooltip
          .append("text")
          .attr("font-size", "11px")
          .style("visibility", "hidden");

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          tempText.text(testLine);
          const testWidth = (tempText.node() as SVGTextElement).getComputedTextLength();

          if (testWidth > maxTooltipWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
            if (lines.length >= 3) break; // Max 3 lines
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine && lines.length < 3) {
          lines.push(currentLine);
        }
        if (lines.length === 3 && words.length > lines.join(" ").split(" ").length) {
          lines[lines.length - 1] = lines[lines.length - 1] + "...";
        }
        tempText.remove();

        // Add text lines
        lines.forEach((line, i) => {
          tooltipText
            .append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? 0 : 13)
            .text(line);
        });

        // Position and size tooltip
        const textBBox = (tooltipText.node() as SVGTextElement).getBBox();
        const padding = 10;
        tooltipBg
          .attr("x", textBBox.x - padding)
          .attr("y", textBBox.y - padding)
          .attr("width", textBBox.width + padding * 2)
          .attr("height", textBBox.height + padding * 2);

        // Position tooltip above node (below the website tag)
        tooltip.attr("transform", `translate(${-textBBox.width / 2}, ${-d.radius - textBBox.height - 45})`);

        // Animate tooltip in
        tooltip
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("opacity", 1);

        // Find connected node IDs
        const connectedIds = new Set<string>();
        links.forEach((l: any) => {
          if (l.source.id === d.id) connectedIds.add(l.target.id);
          if (l.target.id === d.id) connectedIds.add(l.source.id);
        });

        // Enhance glow on adjacent nodes
        node.each(function (n) {
          const nodeElement = d3.select(this);
          if (connectedIds.has(n.id)) {
            // Adjacent nodes get enhanced glow
            nodeElement
              .select(".glow")
              .transition()
              .duration(300)
              .attr("fill", "rgba(180, 210, 255, 0.4)");
          } else if (n.id !== d.id) {
            // Other nodes dim slightly
            nodeElement.transition().duration(300).style("opacity", 0.5);
          }
        });
      })
      .on("mouseleave", function (event, d) {
        setHoveredNode(null);

        const currentNode = d3.select(this);

        // Reset scale and glow
        currentNode
          .select(".main")
          .transition()
          .duration(400)
          .ease(d3.easeCubicOut)
          .attr("r", d.radius)
          .attr("filter", "url(#glow)");

        currentNode
          .select(".glow")
          .transition()
          .duration(400)
          .ease(d3.easeCubicOut)
          .attr("r", d.radius + 8)
          .attr(
            "fill",
            d.size === 3
              ? "rgba(180, 200, 255, 0.3)"
              : d.size === 2
                ? "rgba(160, 190, 240, 0.2)"
                : "rgba(140, 170, 220, 0.15)"
          );

        // Hide link icon
        currentNode
          .select(".link-icon")
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr("opacity", 0);

        // Remove tooltip and website tag immediately
        currentNode.select(".hover-tooltip").remove();
        currentNode.select(".website-tag").remove();

        // Reset all node glows and opacity
        node.each(function (n) {
          const nodeElement = d3.select(this);
          nodeElement
            .select(".glow")
            .transition()
            .duration(400)
            .attr(
              "fill",
              n.size === 3
                ? "rgba(180, 200, 255, 0.3)"
                : n.size === 2
                  ? "rgba(160, 190, 240, 0.2)"
                  : "rgba(140, 170, 220, 0.15)"
            );
          nodeElement.transition().duration(400).style("opacity", 1);
        });
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        // Open link in new tab
        window.open(d.link, "_blank", "noopener,noreferrer");
      });

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions removed - nodes are not draggable

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0d1220] to-[#0f0d1f]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
      </div>

      <svg
        ref={svgRef}
        className="relative h-full w-full"
        style={{ background: "transparent" }}
      />

      {selectedNode && (
        <div className="absolute right-6 top-6 w-96 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1f2e]/95 to-[#151a28]/95 p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-4 flex items-start justify-between">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-light tracking-wide text-blue-300 ring-1 ring-blue-400/20">
                {selectedNode.topic}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-white/40 transition-colors hover:text-white/80"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <h3 className="mb-3 text-lg font-light tracking-tight text-white">
              {selectedNode.title}
            </h3>
            <p className="mb-5 text-sm font-light leading-relaxed text-white/60">
              {selectedNode.overview}
            </p>
            <a
              href={selectedNode.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-light text-white ring-1 ring-white/20 backdrop-blur-xl transition-all hover:bg-white/15 hover:ring-white/30"
            >
              Visit Resource
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
