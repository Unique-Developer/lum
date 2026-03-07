/**
 * Seed MongoDB with data from JSON files.
 * Run: node scripts/seed-mongodb.js
 * Requires: MONGODB_URI, MONGODB_DB in .env.local (or env)
 */
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

async function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    });
  }
}

async function main() {
  await loadEnv();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "luminart";

  if (!uri) {
    console.error("MONGODB_URI not set. Add it to .env.local");
    process.exit(1);
  }

  const dataDir = path.join(process.cwd(), "src", "data");
  let catalogues = [];
  let posts = [];

  try {
    const catPath = path.join(dataDir, "catalogues.json");
    if (fs.existsSync(catPath)) {
      catalogues = JSON.parse(fs.readFileSync(catPath, "utf-8"));
      console.log(`Loaded ${catalogues.length} catalogues`);
    }
  } catch (e) {
    console.warn("No catalogues.json or parse error:", e.message);
  }

  try {
    const blogPath = path.join(dataDir, "blog-posts.json");
    if (fs.existsSync(blogPath)) {
      posts = JSON.parse(fs.readFileSync(blogPath, "utf-8"));
      console.log(`Loaded ${posts.length} blog posts`);
    }
  } catch (e) {
    console.warn("No blog-posts.json or parse error:", e.message);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  if (catalogues.length > 0) {
    await db.collection("catalogues").deleteMany({});
    await db.collection("catalogues").insertMany(catalogues);
    console.log("Seeded catalogues");
  }

  if (posts.length > 0) {
    await db.collection("blog_posts").deleteMany({});
    await db.collection("blog_posts").insertMany(posts);
    console.log("Seeded blog_posts");
  }

  await client.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
