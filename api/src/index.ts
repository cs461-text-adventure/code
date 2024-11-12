import "dotenv/config";
import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { gamesTable } from "./db/schema.ts";
import process from "node:process";

const db = drizzle(process.env.DATABASE_URL!);

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send({ "message": "Hello World!" });
});

app.get("/games", async (req, res) => {
  const games = await db.select().from(gamesTable);
  res.send(games);
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
