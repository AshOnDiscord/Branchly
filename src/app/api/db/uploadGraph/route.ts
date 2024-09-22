import mongoClient from "@/app/api/db/mongo";
import Graph from "@/models/Graph";
import { NodeData } from "@/types/GraphTypes";
import { v7, validate } from "uuid";

export const GET = async (req: Request) => {
  return new Response("GET request received");
};

export const POST = async (req: Request) => {
  const data: Graph = await req.json();
  const nodeMap = new Map<string, string>();
  const groupMap = new Map<string, string>();
  for (const node of data.nodes) {
    if (validate(node._id)) {
      nodeMap.set(node._id, node._id);
    } else {
      nodeMap.set(node._id, v7());
      node._id = nodeMap.get(node._id)!;
    }
    if (groupMap.has(node.groupID)) {
      node.groupID = groupMap.get(node.groupID)!;
    } else {
      if (validate(node.groupID)) {
        groupMap.set(node.groupID, node.groupID);
      } else {
        groupMap.set(node.groupID, v7());
        node.groupID = groupMap.get(node.groupID)!;
      }
    }
  }
  console.log(nodeMap, groupMap);
  const prepped = {
    ...data,
    nodes: data.nodes.map((node) => {
      return {
        ...node,
        id: node._id,
        parents: node.parents.map((parent) => {
          return nodeMap.get(parent)!;
        }),
        children: node.children.map((child) => {
          return nodeMap.get(child)!;
        }),
      };
    }) as NodeData[],
  };
  console.log(prepped, "DATA");
  await mongoClient
    .db("skillLink")
    .collection("graphs")
    .insertOne(prepped as any);
  return new Response("POST request received");
};
