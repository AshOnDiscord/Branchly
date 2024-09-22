import mongoClient from "@/app/api/db/mongo";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  return new Response("GET request received");
};

export const POST = async (req: Request) => {
  const { graphId } = await req.json();

  console.log(`publishing ${graphId}...`);

  const graphs = await mongoClient.db("skillLink").collection("graphs");
  const hasGraph = await graphs.findOne({ _id: graphId });
  if (!hasGraph) {
    return new Response("Graph not found", { status: 404 });
  }
  graphs.updateOne({ _id: graphId }, { $set: { published: true } });
  return NextResponse.json({ success: true });
};
