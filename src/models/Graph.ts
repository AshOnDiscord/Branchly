import { ObjectId, Document, WithId } from "mongodb";
import { NodeModel } from "./Node";

type UserId = ObjectId;

export default interface Graph extends WithId<Document> {
  _id: ObjectId;
  name: string;
  description: string;
  author: UserId;
  subscribers: UserId[];
  published: boolean;
  nodes: NodeModel[];
}
