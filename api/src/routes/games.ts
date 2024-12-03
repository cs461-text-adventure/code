import "dotenv/config";
import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { games } from "../db/schema";

const router = express.Router();

// API key middleware
const apiKey = process.env.API_KEY || 'YOUR_SECRET_KEY'; 

const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next(); 
};

// CREATE
router.post("/", authenticate, async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const { name, data } = req.body;
  const game: typeof games.$inferInsert = { name, data };
  const [newGame] = await db.insert(games).values(game).returning();
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
    res.status(404).json({ error: "Game not found" }); // TODO: CHANGE ERROR MESSAGE
  }
});

// UPDATE
router.patch("/:id", authenticate, async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const { name, data } = req.body;
  const id = req.params.id;
  const patchedGame = await db
    .update(games)
    .set({
      name: name,
      data: data,
    })
    .where(eq(games.id, id))
    .returning();
  res.send(patchedGame);
});

// DELETE
router.delete("/:id", authenticate, async (req, res) => {
  // TODO: ADD AUTHENTICATION
  // TODO: ADD INPUT VALIDATION
  const id = req.params.id;
  await db.delete(games).where(eq(games.id, id));
  res.status(204).send();
});

export default router;
