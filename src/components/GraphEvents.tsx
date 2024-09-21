"use client";
import { Map as IMap, List as IList } from "immutable";
import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect, useRef, useState, FC } from "react";
import Modal from "./Modal";
import { GroupId, NodeData, NodeId } from "./nodes";

const GraphEvents = (props: { nodeData: NodeData[] }) => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const requestRef = useRef<number>();
  const highlightedNodes = useRef<Set<string>>(new Set());
  const hoveredNode = useRef<string | null>(null); // Track the hovered node

  const animate = (time: DOMHighResTimeStamp) => {
    const graph = sigma.getGraph();
    const centerX = 1.25;
    const centerY = 1.25;
    const gravityConstant = 0.0002; // Gravity towards center
    const forceConstant = 0.00001; // Decreased repulsion strength
    const maxDistance = 0.3; // maximum allowable distance between two connected nodes in the graph. When the distance between two nodes exceeds this value, the algorithm applies a stronger attractive force to pull the nodes closer together.
    const friction = 0.2; // Friction factor (0 < friction < 1)

    // Initialize node positions and forces
    const nodes = graph.nodes().map((nodeId) => ({
      id: nodeId,
      pos: {
        x: graph.getNodeAttribute(nodeId, "x"),
        y: graph.getNodeAttribute(nodeId, "y"),
      },
      force: { x: 0, y: 0 }, // Initialize force for each node
    }));

    // Apply gravity to all nodes
    nodes.forEach((node) => {
      const forceX = (centerX - node.pos.x) * gravityConstant;
      const forceY = (centerY - node.pos.y) * gravityConstant;
      node.force.x += forceX;
      node.force.y += forceY;
    });

    // Apply repulsive forces between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const pos1 = nodes[i].pos;
        const pos2 = nodes[j].pos;
        const dir = {
          x: pos2.x - pos1.x,
          y: pos2.y - pos1.y,
        };
        const distanceSquared = dir.x * dir.x + dir.y * dir.y;
        const distance = Math.sqrt(distanceSquared);

        if (distance > 0) {
          const forceMagnitude = forceConstant / distanceSquared; // Calculate weaker repulsive force
          const force = {
            x: (dir.x / distance) * forceMagnitude,
            y: (dir.y / distance) * forceMagnitude,
          };

          // Apply repulsion
          nodes[i].force.x -= force.x;
          nodes[i].force.y -= force.y;
          nodes[j].force.x += force.x;
          nodes[j].force.y += force.y;
        }
      }
    }

    // Apply forces based on connected edges
    graph.edges().forEach((edge) => {
      const node1Id = graph.source(edge);
      const node2Id = graph.target(edge);
      const node1 = nodes.find((n) => n.id === node1Id)!;
      const node2 = nodes.find((n) => n.id === node2Id)!;

      const disX = node2.pos.x - node1.pos.x;
      const disY = node2.pos.y - node1.pos.y;
      const distance = Math.sqrt(disX * disX + disY * disY);
      const diff = distance - maxDistance;

      if (diff > 0) {
        // If nodes are too far apart, apply a stronger force towards each other
        const force = {
          x: (disX / distance) * (diff * 0.3), // Increased attraction force
          y: (disY / distance) * (diff * 0.3),
        };
        node1.force.x += force.x; // Apply force to node1
        node1.force.y += force.y;
        node2.force.x -= force.x; // Apply opposite force to node2
        node2.force.y -= force.y;
      }
    });
    // Apply friction to the forces
    nodes.forEach((node) => {
      node.force.x *= friction;
      node.force.y *= friction;
    });

    // Update node positions based on the computed forces
    nodes.forEach((node) => {
      const currentX = graph.getNodeAttribute(node.id, "x");
      const currentY = graph.getNodeAttribute(node.id, "y");
      graph.setNodeAttribute(node.id, "x", currentX + node.force.x);
      graph.setNodeAttribute(node.id, "y", currentY + node.force.y);
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []); // Ensure this runs only once

  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
      },
      mousemovebody: (e) => {
        if (!draggedNode) return;
        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
      doubleClickNode: (e) => {
        const nodeId = e.node;
        const nodeData = sigma.getGraph().getNodeAttributes(nodeId);
        console.log("Node double-clicked:", nodeId, nodeData);
        setModalData(nodeData as any);
        setIsModalOpen(true);
      },

      enterNode: (event) => {
        const nodeId = event.node;
        hoveredNode.current = nodeId; // Set hovered node

        const groupID = sigma.getGraph().getNodeAttribute(nodeId, "groupID");

        sigma
          .getGraph()
          .nodes()
          .forEach((otherNodeId) => {
            const otherGroupID = sigma
              .getGraph()
              .getNodeAttribute(otherNodeId, "groupID");

            const isSameGroup = groupID === otherGroupID;

            sigma
              .getGraph()
              .setNodeAttribute(otherNodeId, "highlighted", isSameGroup);

            // Change color of non-highlighted nodes to white
            if (!isSameGroup) {
              sigma
                .getGraph()
                .setNodeAttribute(otherNodeId, "tempColor", "#cbd5e1")
                .setNodeAttribute(otherNodeId, "tempBorderColor", "#cbd5e1")
                .setNodeAttribute(otherNodeId, "labelColor", "#64748b")
                .setNodeAttribute(otherNodeId, "label", "");
            }
            highlightedNodes.current.add(otherNodeId);
          });
      },
      leaveNode: (event) => {
        hoveredNode.current = null; // Reset hovered node
        highlightedNodes.current.forEach((nodeId) => {
          const ogColor = sigma.getGraph().getNodeAttribute(nodeId, "color");
          const ogBorderColor = sigma
            .getGraph()
            .getNodeAttribute(nodeId, "borderColor");
          const ogLabel = sigma.getGraph().getNodeAttribute(nodeId, "ogLabel");
          sigma
            .getGraph()
            .setNodeAttribute(nodeId, "highlighted", false)
            .setNodeAttribute(nodeId, "tempColor", ogColor)
            .setNodeAttribute(nodeId, "tempBorderColor", ogBorderColor)
            .setNodeAttribute(nodeId, "label", ogLabel);
          sigma
            .getGraph()
            .setNodeAttribute(nodeId, "tempBorderColor", ogBorderColor);
        });
        highlightedNodes.current.clear();
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} nodeData={modalData} />
      {/* The rest of your component */}
    </>
  );
};

export default GraphEvents;
