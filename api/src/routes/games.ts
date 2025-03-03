import "dotenv/config";
import express from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/index";
import { games } from "@/db/schema";
import { authenticate } from "@/lib/middleware";

const router = express.Router();

// CREATE
router.post("/", authenticate, async (req, res) => {
  // TODO: ADD INPUT VALIDATION

  // Get user session
  const session = req.session;
  const userId = session!.user.id;

  const { name, data } = req.body;
  const game: typeof games.$inferInsert = { name, data, userId };
  const [newGame] = await db.insert(games).values(game).returning();
  res.status(201).json(newGame);
});

// READ ALL
router.get("/", async (req, res) => {
  // TODO: ADD PAGINATION
  const gamesList = await db.select().from(games);
  res.send(gamesList);
});

// READ USER'S GAMES
router.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.session!.user.id;
    const userGames = await db
      .select()
      .from(games)
      .where(eq(games.userId, userId));
    res.json(userGames);
  } catch (error) {
    console.error("Error fetching user games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// READ PUBLIC GAMES
router.get("/public", async (req, res) => {
  try {
    const publicGames = await db
      .select()
      .from(games)
      .where(eq(games.isPublic, true));
    res.json(publicGames);
  } catch (error) {
    console.error("Error fetching public games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  // TODO: ADD INPUT VALIDATION
  const id = req.params.id;
  const game = await db.select().from(games).where(eq(games.id, id));
  if (game.length > 0) {
    res.send(game);
  } else {
    res.status(404).json({ error: "Game not found" }); // TODO: CHANGE ERROR MESSAGE
  }
});

// UPDATE
router.patch("/:id", authenticate, async (req, res): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = req.session!.user.id;
    
    // Verify ownership
    const [existingGame] = await db
      .select()
      .from(games)
      .where(and(eq(games.id, id), eq(games.userId, userId)));

    if (!existingGame) {
      res.status(404).json({ error: "Game not found" });
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
router.delete("/:id", authenticate, async (req, res): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = req.session!.user.id;

    // Verify ownership
    const [existingGame] = await db
      .select()
      .from(games)
      .where(and(eq(games.id, id), eq(games.userId, userId)));

    if (!existingGame) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    await db.delete(games).where(eq(games.id, id));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
