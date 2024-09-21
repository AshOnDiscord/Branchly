import { ObjectId } from "mongodb";

export type NodeId = ObjectId;
export type GroupId = ObjectId;
export enum NodeStatus {
  COMPLETED,
  IN_PROGRESS,
  LOCKED,
}
export interface NodeData {
  id: NodeId | string; // auto generate
  displayName: string;
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
  source: NodeId;
  target: NodeId;
}
