import { NodeData, NodeId, NodeStatus } from "@/types/GraphTypes";
import { ObjectId, Document, WithId } from "mongodb";

type UserId = ObjectId;

export default interface Graph extends WithId<Document> {
  _id: ObjectId;
  name: string;
  description: string;
  author: UserId;
  subscribers: UserId[];
  published: boolean;
  nodes: (Omit<NodeData, "id"> & { _id: NodeId })[];
}
