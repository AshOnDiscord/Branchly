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
    x: 2,
    y: -3,
    size: 10,
    completed: 0.8,
    status: NodeStatus.IN_PROGRESS,
    groupID: 2,
    children: [1, 2, 3, 11],
    parents: [],
  },
  {
    id: 1,
    displayName: "Node_1",
    x: -1,
    y: 0,
    size: 10,
    completed: 0,
    status: NodeStatus.LOCKED,
    groupID: 1,
    children: [3],
    parents: [0],
  },
  {
    id: 2,
    displayName: "Node_2",
    x: 3,
    y: 1,
    size: 10,
    completed: 0.5,
    status: NodeStatus.IN_PROGRESS,
    groupID: 0,
    children: [5, 8],
    parents: [0],
  },
  {
    id: 3,
    displayName: "Node_3",
    x: 0,
    y: -2,
    size: 10,
    completed: 1,
    status: NodeStatus.COMPLETED,
    groupID: 1,
    children: [4],
    parents: [1],
  },
  {
    id: 4,
    displayName: "Node_4",
    x: -3,
    y: 2,
    size: 10,
    completed: 1,
    status: NodeStatus.COMPLETED,
    groupID: 0,
    children: [],
    parents: [3],
  },
  {
    id: 5,
    displayName: "Node_5",
    x: 1,
    y: -1,
    size: 10,
    completed: 0,
    status: NodeStatus.LOCKED,
    groupID: 2,
    children: [6, 7, 10],
    parents: [2],
  },
  {
    id: 6,
    displayName: "Node_6",
    x: -4,
    y: 4,
    size: 10,
    completed: 0.6,
    status: NodeStatus.IN_PROGRESS,
    groupID: 1,
    children: [],
    parents: [5],
  },
  {
    id: 7,
    displayName: "Node_7",
    x: 3,
    y: -4,
    size: 10,
    completed: 0,
    status: NodeStatus.LOCKED,
    groupID: 2,
    children: [],
    parents: [5],
  },
  {
    id: 8,
    displayName: "Node_8",
    x: 4,
    y: 0,
    size: 10,
    completed: 1,
    status: NodeStatus.COMPLETED,
    groupID: 0,
    children: [9],
    parents: [2],
  },
  {
    id: 9,
    displayName: "Node_9",
    x: -2,
    y: 3,
    size: 10,
    completed: 0.4,
    status: NodeStatus.IN_PROGRESS,
    groupID: 1,
    children: [],
    parents: [8],
  },
  {
    id: 10,
    displayName: "Node_10",
    x: 1,
    y: -3,
    size: 10,
    completed: 1,
    status: NodeStatus.COMPLETED,
    groupID: 2,
    children: [12],
    parents: [5],
  },
  {
    id: 11,
    displayName: "Node_11",
    x: -1,
    y: 2,
    size: 10,
    completed: 0,
    status: NodeStatus.LOCKED,
    groupID: 0,
    children: [1],
    parents: [10],
  },
  {
    id: 12,
    displayName: "Node_12",
    x: 4,
    y: 3,
    size: 10,
    completed: 1,
    status: NodeStatus.COMPLETED,
    groupID: 1,
    children: [13],
    parents: [10],
  },
  {
    id: 13,
    displayName: "Node_13",
    x: -3,
    y: 1,
    size: 10,
    completed: 0.9,
    status: NodeStatus.IN_PROGRESS,
    groupID: 3,
    children: [14],
    parents: [12],
  },
  {
    id: 14,
    displayName: "Node_14",
    x: 2,
    y: -1,
    size: 10,
    completed: 1,
    status: NodeStatus.COMPLETED,
    groupID: 2,
    children: [],
    parents: [13],
  },
];

export default nodes;
