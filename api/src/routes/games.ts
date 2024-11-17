import "dotenv/config";
import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { games } from "../db/schema.ts";

const router = express.Router();
const db = drizzle(Deno.env.get('DATABASE_URL') as string);

// CREATE
router.post("/", async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const { name, data } = req.body;
  const game: typeof games.$inferInsert = { name, data };
  const [newGame] = await db.insert(games).values(game).returning()
  res.status(201).json(newGame);
});

// READ
router.get("/", async (req, res) => {
  // TODO: ADD PAGINATION
  const gamesList = await db.select().from(games);
  res.send(gamesList);
});

// READ
router.get("/:id", async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const id = req.params.id;
  const game = await db.select().from(games).where(eq(games.id, id));
  if (game.length > 0) {
    res.send(game);
  } else {
    res.status(404).send("Game not found");
  }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const { name, data } = req.body;
  const id = req.params.id;
  const patchedGame = await db
    .update(games)
    .set({
      name: name,
      data: data
    })
    .where(eq(games.id, id)).returning();
  res.send(patchedGame);
});

// DELETE
router.delete("/:id", async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const id = req.params.id;
  await db.delete(games).where(eq(games.id, id));
  res.status(204).send();
});

export default router;