// given two graphs and 2 similar nodes, the GraphMerger class will merge the two graphs into one graph (keep the 2 roots, just add an edge between them)

import Graph from "@/models/Graph";
import { NodeStatus } from "@/types/GraphTypes";
import { v7 } from "uuid";

const MergeGraphs = (
  graph1: Graph | Pick<Graph, "nodes">,
  graph2: Graph | Pick<Graph, "nodes">,
  node1ID: string,
  node2ID: string,
): Graph => {
  const allNodes = [...graph1.nodes, ...graph2.nodes];
  const node1 = allNodes.find(
    (node) => node.id === node1ID || node._id === node1ID,
  );
  const node2 = allNodes.find(
    (node) => node.id === node2ID || node._id === node2ID,
  );
  if (!node1 || !node2) {
    throw new Error("Nodes not found");
  }
  node1.children.push(node2ID);
  node1.parents.push(node2ID);
  node2.children.push(node1ID);
  node2.parents.push(node1ID);

  let mergedAuthors = "";
  if (!graph1.author || !graph2.author) {
    mergedAuthors = graph1.author || graph2.author || "";
  } else if ((graph1 as Graph).author === (graph2 as Graph).author) {
    mergedAuthors = (graph1 as Graph).author;
  } else {
    mergedAuthors = `${(graph1 as Graph).author} & ${(graph2 as Graph).author}`;
  }

  const newGraph: Graph = {
    _id: v7(),
    name: `${graph1.name} & ${graph2.name}`,
    author: mergedAuthors,
    description: `${graph1.description} & ${graph2.description}`,
    subscribers: [], // we could also merge the subscribers
    published: false,
    nodes: allNodes,
  };

  return newGraph;
};

export default MergeGraphs;

export const RootMerge = (
  graphA: Graph | Pick<Graph, "nodes">,
  graphB: Graph | Pick<Graph, "nodes">,
) => {
  const aRoots = graphA.nodes.filter((node) => node.status === NodeStatus.ROOT);
  const bRoots = graphB.nodes.filter((node) => node.status === NodeStatus.ROOT);
  return {
    aId: aRoots[0]._id,
    bId: bRoots[0]._id,
  };
};
