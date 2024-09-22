import MergeGraphs, { RootMerge } from "@/app/util/MergeGraph";
import mongoClient from "@/app/api/db/mongo";
import Graph from "@/models/Graph";

export const GET = async (req: Request) => {
  return new Response("GET request received");
};

export const POST = async (req: Request) => {
  const { graphA, graphB } = await req.json();
  console.log(graphA, graphB);
  const graphADoc: Graph | null = (await mongoClient
    .db("skillLink")
    .collection("graphs")
    .findOne({ _id: graphA })) as any;
  const graphBDoc: Graph | null = (await mongoClient
    .db("skillLink")
    .collection("graphs")
    .findOne({ _id: graphB })) as any;
  console.log(graphADoc, graphBDoc);
  if (!graphADoc || !graphBDoc) {
    return new Response("Graphs not found", { status: 404 });
  }

  const { aId: targetA, bId: targetB } = RootMerge(graphADoc, graphBDoc);

  const mergedGraph = MergeGraphs(
    graphADoc as any, // the user main graph
    graphBDoc as any, // graph from the list
    targetA,
    targetB,
  );
  const doc = await mongoClient
    .db("skillLink")
    .collection("graphs")
    .insertOne(mergedGraph as any);

  return new Response(
    mergedGraph._id + " Graphs merged successfully" + doc.insertedId,
  );
};
