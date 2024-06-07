"use client";

import { useEffect } from "react";
import * as d3 from "d3";

const drawTopology = () => {
  const width = 800;
  const height = 600;

  // Nodes array with unique ids
  const nodes = [
    { id: 1, name: "Router" },
    { id: 2, name: "PC1" },
    { id: 3, name: "PC2" },
    { id: 4, name: "PC3" },
  ];

  // Links array using node ids
  const links = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 1, target: 4 },
  ];

  const svg = d3
    .select("#topology-diagram")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create simulation with forces
  const simulation = d3
    .forceSimulation(nodes as any)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d: any) => d.id)
        .distance(100)
        .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 2);

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 10)
    .attr("fill", "#69b3a2")
    .call(drag(simulation));

  const labels = svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("dy", 4)
    .attr("dx", 12)
    .text((d) => d.name);

  function ticked() {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

    labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
  }

  function drag(simulation: any) {
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
};

const Topology = () => {
  useEffect(() => {
    drawTopology();
  }, []);

  return (
    <div>
      <h1 className="text-black">Network Topology</h1>
      <div id="topology-diagram"></div>
    </div>
  );
};

export default Topology;
