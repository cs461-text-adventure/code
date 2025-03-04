import "dotenv/config";
import express from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { games, user } from "@/db/schema";
import { authenticate } from "@/lib/middleware";

const router = express.Router();

// CREATE
router.post("/", authenticate, async (req, res) => {
  // TODO: ADD INPUT VALIDATION
  const session = req.session;
  const userId = session!.user.id;

  const { name, data, isPublic } = req.body;
  const game: typeof games.$inferInsert = { name, userId, data, isPublic };

  const [newGame] = await db.insert(games).values(game).returning();
  res.status(201).json(newGame);
});

// GET ALL PUBLIC GAMES
router.get("/", async (req, res) => {
  // TODO: ADD PAGINATION
  const gamesList = await db
    .select({
      id: games.id,
      name: games.name,
      isPublic: games.isPublic,
      author: user.name,
    })
    .from(games)
    .innerJoin(user, eq(games.userId, user.id))
    .where(eq(games.isPublic, true));
  res.json(gamesList);
});

// GET ALL LOGGED IN USER'S GAMES
router.get("/me", authenticate, async (req, res) => {
  const session = req.session;
  const userId = session!.user.id;
  const gamesList = await db
    .select()
    .from(games)
    .where(eq(games.userId, userId));
  res.json(gamesList);
});

// READ
router.get("/:id", async (req, res) => {
  // TODO: ADD INPUT VALIDATION
  const gameId = req.params.id;

  const game = await db
    .select({
      id: games.id,
      name: games.name,
      isPublic: games.isPublic,
      data: games.data,
      author: user.name,
    })
    .from(games)
    .innerJoin(user, eq(games.userId, user.id)) // Join with user table
    .where(eq(games.id, gameId));

  if (!game.length) {
    res.status(404).json({ error: "Game not found" }); // TODO: EDIT ERROR MESSAGE
    return;
  }

  res.json(game[0]);
});

// UPDATE
router.patch("/:id", authenticate, async (req, res) => {
  const session = req.session;
  const userId = session!.user.id;
  const gameId = req.params.id;

  const game = await db.select().from(games).where(eq(games.id, gameId));

  // Check game exists
  if (!game.length) {
    res.status(404).json({ error: "Game not found" }); // TODO: EDIT ERROR MESSAGE
    return;
  }

  // Check game belongs to current user
  if (game[0].userId !== userId) {
    res.status(403).json({ error: "Forbidden" }); // TODO: EDIT ERROR MESSAGE
    return;
  }

  // TODO: ADD INPUT VALIDATION
  const { name, data, isPublic } = req.body;

  const patchedGame = await db
    .update(games)
    .set({ name, data, isPublic })
    .where(eq(games.id, gameId))
    .returning();

  res.json(patchedGame[0]);
});

// DELETE
router.delete("/:id", authenticate, async (req, res) => {
  // TODO: ADD INPUT VALIDATION
  const session = req.session;
  const userId = session!.user.id;
  const gameId = req.params.id;

  const game = await db.select().from(games).where(eq(games.id, gameId));

  // Check game exists
  if (!game.length) {
    res.status(404).json({ error: "Game not found" }); // TODO: EDIT ERROR MESSAGE
    return;
  }

  // Check game belongs to current user
  if (game[0].userId !== userId) {
    res.status(403).json({ error: "Forbidden" }); // TODO: EDIT ERROR MESSAGE
    return;
  }

  await db.delete(games).where(eq(games.id, gameId));
  res.status(204).send();
});

export default router;
