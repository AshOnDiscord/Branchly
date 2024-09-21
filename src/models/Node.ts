import { GroupId, NodeData, NodeId, NodeStatus } from "@/types/GraphTypes";
import { WithId, Document } from "mongodb";

export interface NodeModel extends NodeData, WithId<Document> {
  _id: NodeId;
}
