import { NodeData } from "@/types/GraphTypes";
import { Document } from "mongodb";

type UserId = string; // uuid v7

export default interface Graph extends Document {
  _id: string;
  name: string;
  description: string;
  author: UserId;
  subscribers: UserId[];
  published: boolean;
  preview?: string; // link to the preview image
  nodes: (NodeData & { _id: string })[];
}
