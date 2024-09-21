import { type NodeData, NodeStatus } from "@/types/GraphTypes";

const nodes: NodeData[] = [
  {
    id: 0,
    displayName: "Node_0",
    x: 0,
    y: 0,
    size: 10,
    progress: 0.8, // In progress but not completed
    status: NodeStatus.IN_PROGRESS,
    groupID: 1,
    groupName: "Group_1",
    children: [1, 2],
    parents: [],
  },
  {
    id: 1,
    displayName: "Node_1",
    x: 1,
    y: 2,
    size: 10,
    progress: 0, // Locked node must have completed = 0
    status: NodeStatus.LOCKED,
    groupID: 1,
    groupName: "Group_1",
    children: [],
    parents: [0],
  },
  {
    id: 2,
    displayName: "Node_2",
    x: 0,
    y: 1,
    size: 10,
    progress: 0.5, // In progress but not completed
    status: NodeStatus.IN_PROGRESS,
    groupID: 0,
    groupName: "Group_0",
    children: [],
    parents: [0],
  },
];

export default nodes;
