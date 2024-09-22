import mongoClient from "@/app/api/db/mongo";
import User from "@/models/User";

export const GET = async (req: Request) => {
  return new Response("GET request received");
};

export const POST = async (req: Request) => {
  const { userId, email } = await req.json();

  const users = mongoClient.db("skillLink").collection("users");
  if (await users.findOne({ _id: userId })) {
    return new Response("User already exists", { status: 400 });
  }
  // create a new user
  const userData: User = {
    _id: userId,
    email,
    tree: {
      nodes: [
        {
          _id: "00000000-0000-0000-0000-000000000000",
          id: "00000000-0000-0000-0000-000000000000",
          displayName: "Your Skill Tree",
          description: "The root of your skill tree.",
          x: 0,
          y: 0,
          size: 9,
          progress: 0,
          status: 0,
          groupID: "00000000-0000-0000-0000-000000000000",
          groupName: "Ungrouped Nodes",
          children: [],
          parents: [],
        },
      ],
    },
  };

  console.log(userData);
  await users.insertOne(userData as any);
  return new Response("User created successfully");
};
