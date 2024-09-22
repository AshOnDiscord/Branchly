import { NodeData, NodeStatus, PartialNode } from "@/types/GraphTypes";

const nodeData: PartialNode[] = [
  {
    nodeID: 0,
    displayName: "Limits",
    description:
      "Understanding the concept of limits and how they relate to functions.",
    children: [1, 2],
    parents: [],
  },
  {
    nodeID: 1,
    displayName: "One-Sided Limits",
    description: "Learning about one-sided limits and how to evaluate them.",
    children: [3],
    parents: [0],
  },
  {
    nodeID: 2,
    displayName: "Infinite Limits",
    description: "Understanding infinite limits and how to evaluate them.",
    children: [4],
    parents: [0],
  },
  {
    nodeID: 3,
    displayName: "Squeeze Theorem",
    description: "Applying the squeeze theorem to evaluate limits.",
    children: [5],
    parents: [1],
  },
  {
    nodeID: 4,
    displayName: "Limit Properties",
    description:
      "Learning about the properties of limits and how to apply them.",
    children: [5],
    parents: [2],
  },
  {
    nodeID: 5,
    displayName: "Derivatives",
    description:
      "Understanding the concept of derivatives and how to find them.",
    children: [6, 7],
    parents: [3, 4],
  },
  {
    nodeID: 6,
    displayName: "Differentiation Rules",
    description:
      "Learning about the power rule, product rule, and quotient rule for differentiation.",
    children: [8],
    parents: [5],
  },
  {
    nodeID: 7,
    displayName: "Implicit Differentiation",
    description: "Understanding implicit differentiation and how to apply it.",
    children: [9],
    parents: [5],
  },
  {
    nodeID: 8,
    displayName: "Higher-Order Derivatives",
    description:
      "Learning about higher-order derivatives and how to find them.",
    children: [10],
    parents: [6],
  },
  {
    nodeID: 9,
    displayName: "Logarithmic Differentiation",
    description:
      "Understanding logarithmic differentiation and how to apply it.",
    children: [10],
    parents: [7],
  },
  {
    nodeID: 10,
    displayName: "Applications of Derivatives",
    description:
      "Learning about the applications of derivatives in optimization and physics.",
    children: [11],
    parents: [8, 9],
  },
  {
    nodeID: 11,
    displayName: "Integrals",
    description:
      "Understanding the concept of integrals and how to evaluate them.",
    children: [12, 13],
    parents: [10],
  },
  {
    nodeID: 12,
    displayName: "Substitution Method",
    description: "Learning about the substitution method for integration.",
    children: [14],
    parents: [11],
  },
  {
    nodeID: 13,
    displayName: "Integration by Parts",
    description: "Understanding integration by parts and how to apply it.",
    children: [14],
    parents: [11],
  },
  {
    nodeID: 14,
    displayName: "Improper Integrals",
    description: "Learning about improper integrals and how to evaluate them.",
    children: [15],
    parents: [12, 13],
  },
  {
    nodeID: 15,
    displayName: "Multivariable Calculus",
    description: "Understanding the basics of multivariable calculus.",
    children: [16],
    parents: [14],
  },
  {
    nodeID: 16,
    displayName: "Vector Calculus",
    description: "Learning about vector calculus and its applications.",
    children: [17],
    parents: [15],
  },
  {
    nodeID: 17,
    displayName: "Differential Equations",
    description:
      "Understanding the basics of differential equations and how to solve them.",
    children: [18],
    parents: [16],
  },
  {
    nodeID: 18,
    displayName: "Series and Sequences",
    description:
      "Learning about series and sequences and their applications in calculus.",
    children: [19],
    parents: [17],
  },
  {
    nodeID: 19,
    displayName: "Taylor Series",
    description: "Understanding Taylor series and how to apply them.",
    children: [],
    parents: [18],
  },
];

export const mapNode = (data: PartialNode[]): NodeData[] =>
  data.map((node): NodeData => {
    return {
      id: `${node.nodeID}`,
      displayName: node.displayName,
      description: node.description,
      x: Math.random(),
      y: Math.random(),
      size:
        3 +
        3 *
          (node.children.length + node.parents.length) *
          (node.nodeID === 0 ? 2 : 1), // decrease (?)
      progress: Math.random(),
      status: node.nodeID === 0 ? NodeStatus.ROOT : NodeStatus.LOCKED,
      groupID: `0`,
      groupName: "Group 0",
      children: node.children.map((child) => `${child}`),
      parents: node.parents.map((parent) => `${parent}`),
    };
  });

export default mapNode(nodeData);
