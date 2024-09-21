import { NodeData, NodeId, NodeStatus } from "./nodes"; // Import the JSON file
import { useLoadGraph } from "@react-sigma/core";
import Graph from "graphology";
import { useEffect } from "react";

interface Edge {
  source: NodeId;
  target: NodeId;
}

const addEdge = (
  node: NodeId,
  nodes: Map<NodeId, NodeData>,
  addedNodes: Set<NodeId>,
): Edge[] => {
  if (addedNodes.has(node)) {
    return [];
  }
  addedNodes.add(node);
  const edges: Edge[] = [];
  for (const child of nodes.get(node)!.children || []) {
    edges.push({ source: node, target: child });
    edges.push(...addEdge(child, nodes, addedNodes));
  }
  return edges;
};

const nodeTypeData = {
  [NodeStatus.COMPLETED]: {
    color: "#6366f1",
    borderColor: "#6366f1",
  },
  [NodeStatus.IN_PROGRESS]: {
    color: "white",
    borderColor: "#6366f1",
  },
  [NodeStatus.LOCKED]: {
    color: "#64748b",
    borderColor: "#64748b",
  },
};

const LoadGraph = (props: { nodeData: NodeData[] }) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    console.log(props);

    const addedNodes = new Set<NodeId>();
    const edges = addEdge(0, nodeMap, addedNodes);
    graph.import({
      nodes: props.nodeData.map((node) => ({
        key: node.id,
        attributes: {
          x: node.x,
          y: node.y,
          size: node.size,
          label: node.displayName,
          ogLabel: node.displayName,
          type: "border",
          color: nodeTypeData[node.status].color,
          tempColor: nodeTypeData[node.status].color,
          borderColor: nodeTypeData[node.status].borderColor,
          tempBorderColor: nodeTypeData[node.status].borderColor,
          groupID: node.groupID,
        },
      })) as any,
      edges: edges.map((edge, i) => {
        return {
          key: i,
          source: edge.source,
          target: edge.target,
          attributes: {
            size: 1,
          },
        };
      }) as any,
    });

    loadGraph(graph);
  }, [loadGraph]);

  const nodeMap = new Map<NodeId, NodeData>();
  for (const node of props.nodeData) {
    nodeMap.set(node.id, node);
  }

  return null;
};

export default LoadGraph;
