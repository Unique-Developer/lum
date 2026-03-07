import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
const dbName = process.env.MONGODB_DB ?? "luminart";

let cached: { client: MongoClient; db: Db } | null = null;

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (cached) return cached.db;
  const client = new MongoClient(uri);
  await client.connect();
  cached = { client, db: client.db(dbName) };
  return cached.db;
}
