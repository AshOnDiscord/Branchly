import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL!, {});
(async () => {
  try {
    console.log("Connecting to MongoDB");
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
})();

export default client;
