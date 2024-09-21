import { ObjectId } from "mongodb";

export type NodeId = ObjectId;
export type GroupId = ObjectId;
export enum NodeStatus {
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
  id: NodeId | string; // auto generate
  displayName: string;
  description: string;
  x: number; // auto generate
  y: number; // auto generate
  size: number; // auto generate
  progress: number; // 0-1
  status: NodeStatus; // 0-2
  groupID: GroupId | string;
  groupName: string;
  children: (NodeId | string)[];
  parents: (NodeId | string)[];
}

export interface Edge {
  source: NodeId | string;
  target: NodeId | string;
}
