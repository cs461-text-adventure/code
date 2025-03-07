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
  const userId = req.session!.user.id;

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
  const userId = req.session!.user.id;
  const gamesList = await db
    .select()
    .from(games)
    .where(eq(games.userId, userId));
  res.json(gamesList);
});

// READ
router.get("/:id", async (req, res) => {
  // TODO: ADD INPUT VALIDATION
  const id = req.params.id;

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
    .where(eq(games.id, id));

  if (!game.length) {
    res.status(404).json({ error: "Game not found" }); // TODO: EDIT ERROR MESSAGE
    return;
  }

  res.json(game[0]);
});

// UPDATE
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.session!.user.id;

    // Check if game exists
    const [game] = await db.select().from(games).where(eq(games.id, id));
    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    // Check if user owns the game
    if (game.userId !== userId) {
      res.status(403).json({
        error: "Forbidden: You do not have permission to modify this game",
      });
      return;
    }

    const { name, data, isPublic } = req.body;
    const updates: Partial<typeof games.$inferInsert> = {};

    if (name !== undefined) updates.name = name;
    if (data !== undefined) updates.data = data;
    if (isPublic !== undefined) updates.isPublic = isPublic;

    const [updatedGame] = await db
      .update(games)
      .set(updates)
      .where(eq(games.id, id))
      .returning();

    res.json(updatedGame);
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.session!.user.id;

    // Check if game exists
    const [game] = await db.select().from(games).where(eq(games.id, id));
    if (!game) {
      res.status(404).json({ error: "Game not found" }); // TODO: Edit error message
      return;
    }

    // Check if user owns the game
    if (game.userId !== userId) {
      res.status(403).json({
        error: "Forbidden: You do not have permission to delete this game",
      }); // TODO: Edit error message
      return;
    }

    await db.delete(games).where(eq(games.id, id));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ error: "Internal server error" }); // TODO: Edit error message
  }
});

export default router;
