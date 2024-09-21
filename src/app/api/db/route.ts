import { MongoClient } from "mongodb";

export const POST = async (req: Request) => {
  return new Response("POST request received");
};

export const GET = async (req: Request) => {
  const client = new MongoClient(process.env.MONGO_URL!, {});
  console.log("Connecting to MongoDB");

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("sample_mflix");
    const collection = database.collection("users");

    const data = await collection.find().toArray();
    console.log(await collection.countDocuments());

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  } finally {
    await client.close();
  }
};
