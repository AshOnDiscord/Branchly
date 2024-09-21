import { NodeData, NodeStatus } from "@/types/GraphTypes";
import { group } from "console";

const nodeData = [
  {
    nodeID: 0,
    displayName: "Limits",
    additionalInfo:
      "Understanding the concept of limits and how they relate to functions.",
    children: [1, 2],
    parents: [],
    groupID: 0,
  },
  {
    nodeID: 1,
    displayName: "Basic Limit Properties",
    additionalInfo:
      "Understanding the properties of limits, including linearity and the squeeze theorem.",
    children: [3, 4],
    parents: [0],
    groupID: 0,
  },
  {
    nodeID: 2,
    displayName: "Infinite Limits",
    additionalInfo:
      "Understanding infinite limits and how they relate to vertical asymptotes.",
    children: [5],
    parents: [0],
    groupID: 0,
  },
  {
    nodeID: 3,
    displayName: "Limit Laws",
    additionalInfo:
      "Understanding the laws of limits, including the sum, product, and chain rule laws.",
    children: [6],
    parents: [1],
    groupID: 0,
  },
  {
    nodeID: 4,
    displayName: "Squeeze Theorem",
    additionalInfo:
      "Understanding the squeeze theorem and how it can be used to find limits.",
    children: [6],
    parents: [1],
    groupID: 0,
  },
  {
    nodeID: 5,
    displayName: "Vertical Asymptotes",
    additionalInfo:
      "Understanding vertical asymptotes and how they relate to infinite limits.",
    children: [7],
    parents: [2],
    groupID: 0,
  },
  {
    nodeID: 6,
    displayName: "Continuity",
    additionalInfo: "Understanding continuity and how it relates to limits.",
    children: [8],
    parents: [3, 4],
    groupID: 0,
  },
  {
    nodeID: 7,
    displayName: "Types of Discontinuity",
    additionalInfo:
      "Understanding the different types of discontinuity, including removable and jump discontinuity.",
    children: [8],
    parents: [5],
    groupID: 0,
  },
  {
    nodeID: 8,
    displayName: "Derivatives",
    additionalInfo:
      "Understanding the concept of derivatives and how they relate to limits.",
    children: [9, 10],
    parents: [6, 7],
    groupID: 1,
  },
  {
    nodeID: 9,
    displayName: "Derivative Rules",
    additionalInfo:
      "Understanding the rules of derivatives, including the power rule and the product rule.",
    children: [11],
    parents: [8],
    groupID: 1,
  },
  {
    nodeID: 10,
    displayName: "Implicit Differentiation",
    additionalInfo:
      "Understanding implicit differentiation and how it can be used to find derivatives.",
    children: [11],
    parents: [8],
    groupID: 1,
  },
  {
    nodeID: 11,
    displayName: "Applications of Derivatives",
    additionalInfo:
      "Understanding the applications of derivatives, including optimization and motion along a line.",
    children: [12],
    parents: [9, 10],
    groupID: 1,
  },
  {
    nodeID: 12,
    displayName: "Optimization",
    additionalInfo:
      "Understanding optimization and how it can be used to solve real-world problems.",
    children: [],
    parents: [11],
    groupID: 1,
  },
];

const mappedData: NodeData[] = nodeData.map((node) => {
  return {
    id: node.nodeID,
    displayName: node.displayName,
    x: Math.random(),
    y: Math.random(),
    size: 10 * (node.children.length + node.parents.length),
    progress: Math.random(),
    status:
      Math.random() > 0.6
        ? NodeStatus.COMPLETED
        : Math.random() > 0.3
          ? NodeStatus.IN_PROGRESS
          : NodeStatus.LOCKED,
    groupID: node.groupID,
    groupName: "Group 0",
    children: node.children,
    parents: node.parents,
  };
});

export default mappedData;
