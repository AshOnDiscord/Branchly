import { NextResponse } from "next/server";
import mongoClient from "@/app/api/db/mongo";

export const POST = async () => {
  return new Response("POST request received");
};

export const GET = async () => {
  try {
    const database = mongoClient.db("skillLink");
    const collection = database.collection("graphs");

    const data = await collection.find().toArray();
    console.log(await collection.countDocuments());

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, {
      status: 500,
    });
  }
};
