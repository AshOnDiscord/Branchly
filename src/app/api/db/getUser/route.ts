import mongoClient from "@/app/api/db/mongo";
import { NextResponse } from "next/server";

export const GET = async () => {
  return new Response("GET request received");
};

export const POST = async (req: Request) => {
  const { userId, email } = await req.json();

  console.log({
    userId,
    email,
  });

  const user = await mongoClient.db("skillLink").collection("users").findOne({
    _id: userId,
  });

  console.log(user);

  if (!user) {
    fetch("https://branchly-b3xd.vercel.app//api/db/setupUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        email,
      }),
    });
  }
  return NextResponse.json(user);
};
