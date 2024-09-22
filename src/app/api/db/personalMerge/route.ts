import MergeGraphs, { RootMerge } from "@/app/util/MergeGraph";
import mongoClient from "@/app/api/db/mongo";
import Graph from "@/models/Graph";
import User from "@/models/User";

export const GET = async (req: Request) => {
  return new Response("GET request received");
};

export const POST = async (req: Request) => {
  const { graph, userId } = await req.json();
  console.log({ graph, userId });

  const user: User | null = (await mongoClient
    .db("skillLink")
    .collection("users")
    .findOne({ _id: userId })) as any;

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const graphDoc: Graph | null = (await mongoClient
    .db("skillLink")
    .collection("graphs")
    .findOne({ _id: graph })) as any;

  if (!graphDoc) {
    return new Response("Graph not found", { status: 404 });
  }

  const { aId: targetA, bId: targetB } = RootMerge(user.tree, graphDoc);
  console.log({
    targetA,
    targetB,
    user,
    graphDoc: {
      ...graphDoc,
      nodes: graphDoc.nodes.map((node) => JSON.stringify(node)),
    },
  });
  const mergedGraph = MergeGraphs(
    user.tree, // the user main graph
    graphDoc, // graph from the list
    targetA,
    targetB,
  );
  // replace graph nodes with the new graph nodes
  await mongoClient
    .db("skillLink")
    .collection("users")
    .updateOne({ _id: userId }, { $set: { "tree.nodes": mergedGraph.nodes } });
  return new Response("Graph merged successfully");
};
