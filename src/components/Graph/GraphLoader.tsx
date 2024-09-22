import { useLoadGraph } from "@react-sigma/core";
import Graph from "graphology";
import { useEffect } from "react";
import {
  NodeStatus,
  type Edge,
  type NodeData,
  type NodeId,
} from "@/types/GraphTypes";

const addEdge = (
  node: NodeId | string,
  nodes: Map<NodeId | string, NodeData>,
  addedNodes: Set<NodeId | string>,
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
  [NodeStatus.ROOT]: {
    color: "#ffffff",
    borderColor: "#10b981",
  },
  [NodeStatus.COMPLETED]: {
    color: "#6366f1",
    borderColor: "#6366f1",
  },
  [NodeStatus.IN_PROGRESS]: {
    color: "#ffffff",
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

    const nodeMap = new Map<NodeId | string, NodeData>();
    for (const node of props.nodeData) {
      nodeMap.set(node.id, node);
    }

    const addedNodes = new Set<NodeId>();
    let edges: Edge[] = [];
    const roots = props.nodeData.filter(
      (node) => node.status === NodeStatus.ROOT,
    );
    if (roots.length > 0) {
      // console.log("WE HAVE ROOTS");
      for (const root of roots) {
        // console.log("ROOT", root, roots, nodeMap);
        edges.push(...addEdge(root.id ?? root, nodeMap, addedNodes));
      }
    } else {
      console.log("NO ROOTS");
      if (props.nodeData.length > 0) {
        edges.push(...addEdge(props.nodeData[0].id, nodeMap, addedNodes));
      }
    }
    graph.import({
      nodes: props.nodeData.map((node) => ({
        key: node.id,
        attributes: {
          x: node.x,
          y: node.y,
          size: node.size,
          label: node.displayName,
          ogLabel: node.displayName,
          description: node.description,
          type: "border",
          color: nodeTypeData[node.status].color,
          tempColor: nodeTypeData[node.status].color,
          borderColor: nodeTypeData[node.status].borderColor,
          tempBorderColor: nodeTypeData[node.status].borderColor,
          groupID: node.groupID,
          progress: node.progress,
          status: node.status,
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
  }, [loadGraph, props.nodeData]);

  return null;
};

export default LoadGraph;
