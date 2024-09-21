import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import mongoClient from "@/app/api/db/mongo";

export const GET = async (req: Request) => {
  return new Response("GET request received");
};

export const POST = async (req: Request) => {
  console.log(req.body);
};
