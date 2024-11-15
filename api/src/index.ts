import "dotenv/config";
import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { gamesTable } from "./db/schema.ts";
import process from "node:process";

const db = drizzle(process.env.DATABASE_URL!);

const app = express();
const port = 8000;

app.use(express.json());

app.get("/api", (req, res) => {
  // TODO: OPEN API SPEC
  res.send({ "message": "Hello World!" });
});

// CREATE
app.post("/api/games", async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const { name, data } = req.body;
  const game: typeof gamesTable.$inferInsert = { name, data };
  await db.insert(gamesTable).values(game);
  res.status(201).send("Game created");
});

// READ
app.get("/api/games", async (req, res) => {
  // TODO: ADD PAGINATION
  const games = await db.select().from(gamesTable);
  res.send(games);
});

// READ
app.get("/api/games/:id", async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const id = req.params.id;
  const game = await db.select().from(gamesTable).where(eq(gamesTable.id, id));
  if (game.length > 0) {
    res.send(game);
  } else {
    res.status(404).send("Game not found");
  }
});

// UPDATE
app.patch("/api/games/:id", async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const { name, data } = req.body;
  const id = req.params.id;
  await db
    .update(gamesTable)
    .set({
      name: name,
      data: data
    })
    .where(eq(gamesTable.id, id));
  res.send('');
});

// DELETE
app.delete("/api/games/:id", async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const id = req.params.id;
  await db.delete(gamesTable).where(eq(gamesTable.id, id));
  res.status(204).send();
});

// -----------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
