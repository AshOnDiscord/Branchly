export type NodeId = string;
export type GroupId = string;
export enum NodeStatus {
  ROOT,
  COMPLETED,
  IN_PROGRESS,
  LOCKED,
}
export interface PartialNode {
  nodeID: number;
  displayName: string;
  description: string;
  children: number[];
  parents: number[];
}
export interface NodeData {
  id: NodeId; // auto generate
  displayName: string;
  description: string;
  x: number; // auto generate
  y: number; // auto generate
  size: number; // auto generate
  progress: number; // 0-1
  status: NodeStatus; // 0-2
  groupID: GroupId;
  groupName: string;
  children: NodeId[];
  parents: NodeId[];
}

export interface Edge {
  source: NodeId | string;
  target: NodeId | string;
}
