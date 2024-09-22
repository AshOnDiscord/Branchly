"use client";
import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect, useRef, useState } from "react";
import Modal from "@/components/Modal";
import { NodeId, NodeStatus, type NodeData } from "@/types/GraphTypes";
import { Sigma } from "sigma";
import Graph from "graphology";

const updateColor = (node: NodeData, graph: Graph) => {
  let color = "#ffffff";
  let borderColor = "#ffffff";
  switch (node.status) {
    case NodeStatus.ROOT:
      color = "#ffffff";
      borderColor = "#10b981";
      break;
    case NodeStatus.COMPLETED:
      color = "#6366f1";
      borderColor = "#6366f1";
      break;
    case NodeStatus.IN_PROGRESS:
      color = "#ffffff";
      borderColor = "#6366f1";
      break;
    case NodeStatus.LOCKED:
      color = "#64748b";
      borderColor = "#64748b";
      break;
  }
  graph.setNodeAttribute(node.id, "color", color);
  graph.setNodeAttribute(node.id, "tempColor", color);
  graph.setNodeAttribute(node.id, "borderColor", borderColor);
  graph.setNodeAttribute(node.id, "tempBorderColor", borderColor);
};

const updateStatusRecursively = (
  nodeId: NodeId,
  nodes: Map<NodeId, NodeData>,
  checkedNodes: Set<NodeId>,
  graph: Graph,
): void => {
  if (checkedNodes.has(nodeId)) {
    return;
  }
  checkedNodes.add(nodeId);
  const node = nodes.get(nodeId)!;
  if (node.status === NodeStatus.IN_PROGRESS && node.progress === 1) {
    console.log("Completed", node.displayName);
    node.status = NodeStatus.COMPLETED;
    graph.setNodeAttribute(nodeId, "status", NodeStatus.COMPLETED);
    updateColor(node, graph);
  }
  // completed, one padding of in progress, and locked
  if (node.status !== NodeStatus.COMPLETED && node.status !== NodeStatus.ROOT) {
    // console.log("NOW In progress", node.displayName);
    node.status = NodeStatus.IN_PROGRESS; // end of the padding
    graph.setNodeAttribute(nodeId, "status", NodeStatus.IN_PROGRESS);
    updateColor(node, graph);
    return;
  }
  for (const child of nodes.get(nodeId)!.children || []) {
    updateStatusRecursively(child, nodes, checkedNodes, graph);
  }
};

const GraphEvents = (props: { nodeData: NodeData[] }) => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [modalData, setModalData] = useState<{
    label: string;
    description: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const requestRef = useRef<number>();
  const highlightedNodes = useRef<Set<string>>(new Set());
  const hoveredNode = useRef<string | null>(null); // Track the hovered node

  const animate = (time: DOMHighResTimeStamp) => {
    const graph = sigma.getGraph();
    const centerX = 1;
    const centerY = 1;
    const gravityConstant = 0.0001;
    const forceConstant = 0.000025;
    const maxDistance = 0.35;
    const friction = 0; // Friction coefficient (0 < friction < 1)

    // Initialize node positions and forces
    const nodes = graph.nodes().map((nodeId) => ({
      id: nodeId,
      pos: {
        x: graph.getNodeAttribute(nodeId, "x"),
        y: graph.getNodeAttribute(nodeId, "y"),
      },
      force: { x: 0, y: 0 },
    }));

    // Apply gravity
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
          const forceMagnitude = forceConstant / distanceSquared;
          const force = {
            x: (dir.x / distance) * forceMagnitude,
            y: (dir.y / distance) * forceMagnitude,
          };

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
        const force = {
          x: (disX / distance) * (diff * 0.15),
          y: (disY / distance) * (diff * 0.15),
        };
        node1.force.x += force.x;
        node1.force.y += force.y;
        node2.force.x -= force.x;
        node2.force.y -= force.y;
      }
    });

    // Update node positions based on the computed forces and apply friction
    nodes.forEach((node) => {
      const currentX = graph.getNodeAttribute(node.id, "x");
      const currentY = graph.getNodeAttribute(node.id, "y");

      // Update position
      const newX = currentX + node.force.x;
      const newY = currentY + node.force.y;

      // Apply friction to the force
      node.force.x *= friction;
      node.force.y *= friction;

      // Set new position

      graph.setNodeAttribute(node.id, "x", newX);
      graph.setNodeAttribute(node.id, "y", newY);
    });

    const nodeMap = new Map<NodeId | string, NodeData>();
    for (const node of props.nodeData) {
      nodeMap.set(node.id, node);
    }
    updateStatusRecursively(
      "00000000-0000-0000-0000-000000000000",
      nodeMap,
      new Set(),
      graph,
    );

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current ? cancelAnimationFrame(requestRef.current) : null;
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [props.nodeData, props.nodeData.length]); // Ensure this runs only once

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

        if (nodeData.status === NodeStatus.LOCKED) return;

        // Extract label and description from nodeData
        const label = nodeData.label; // Adjust according to your nodeData structure
        const description = nodeData.description; // Adjust according to your nodeData structure

        setModalData({ label, description });
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
      leaveNode: (_event) => {
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
      {modalData && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          label={modalData.label}
          description={modalData.description}
        />
      )}
      {/* The rest of your component */}
    </>
  );
};

export default GraphEvents;
