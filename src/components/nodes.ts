export type NodeId = number;
export type GroupId = number;
export enum NodeStatus {
  COMPLETED,
  IN_PROGRESS,
  LOCKED,
}

export interface NodeData {
  id: NodeId;
  displayName: string;
  x: number;
  y: number;
  size: 10;
  completed: number; // 0-1
  status: NodeStatus;
  groupID: GroupId;
  children: NodeId[];
  parents: NodeId[];
}

const nodes: NodeData[] = [
  {
    id: 0,
    displayName: "Node_0",
    x: 0,
    y: 0,
    size: 10,
    completed: 0.8, // In progress but not completed
    status: NodeStatus.IN_PROGRESS,
    groupID: 1,
    children: [1, 2],
    parents: [],
  },
  {
    id: 1,
    displayName: "Node_1",
    x: 1,
    y: 2,
    size: 10,
    completed: 0, // Locked node must have completed = 0
    status: NodeStatus.LOCKED,
    groupID: 1,
    children: [],
    parents: [0],
  },
  {
    id: 2,
    displayName: "Node_2",
    x: 0,
    y: 1,
    size: 10,
    completed: 0.5, // In progress but not completed
    status: NodeStatus.IN_PROGRESS,
    groupID: 0,
    children: [],
    parents: [0],
  },
];

export default nodes;
