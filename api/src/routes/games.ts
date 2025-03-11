import "dotenv/config";
import express from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { db, games, user } from "@db";
import { authenticate } from "@lib";
import { ORIGIN } from "@config";

const gameSelectSchema = createSelectSchema(games);
const gameInsertSchema = createInsertSchema(games).strict();
const gameUpdateSchema = createUpdateSchema(games).strict();
const gameIdSchema = z.string().uuid();

const router = express.Router();

/**
 * Creates a new game entry in the database.
 * @param {Object} req.body - The game data to insert.
 * @returns {Object} - The newly created game data.
 * @throws {Error} - If validation fails or database insertion fails.
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const userId = req.session!.user.id;
    const input = { ...req.body, userId };

    const game = gameInsertSchema.parse(input);
    const [newGame] = await db.insert(games).values(game).returning();

    res.status(201).json(newGame);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid game content", // TODO: Error message
        documentation_url: `${ORIGIN}/api/#tag/games/POST/games`,
      });
    } else {
      console.error(error); // TODO: Edit error message
      res.status(500).json({ message: "Internal server error" }); // TODO: Edit error message
    }
  }
});

/**
 * Retrieves a list of all public games.
 * @returns {Array} - A list of public games.
 */
router.get("/", async (req, res) => {
  try {
    // TODO: Add pagination
    const gamesList = await db
      .select({
        id: games.id,
        name: games.name,
        isPublic: games.isPublic,
        data: games.data,
        userId: games.userId,
        author: user.name,
      })
      .from(games)
      .innerJoin(user, eq(games.userId, user.id))
      .where(eq(games.isPublic, true));

    const validatedGames = gamesList.map((game) => {
      const validatedGame = gameSelectSchema.parse(game);
      return { ...validatedGame, author: game.author };
    });

    res.status(200).json(validatedGames);
  } catch (error) {
    console.error(error); // TODO: Edit error message
    res.status(500).json({ message: "Internal server error" }); // TODO: Edit error message
  }
});

/**
 * Retrieves a list of games owned by the logged-in user.
 * @param {Object} req.session.user.id - The user's ID from session.
 * @returns {Array} - A list of games owned by the user.
 */
router.get("/me", authenticate, async (req, res) => {
  const userId = req.session!.user.id;

  try {
    const gamesList = await db
      .select()
      .from(games)
      .where(eq(games.userId, userId));

    const validatedGames = gamesList.map((game) => {
      return gameSelectSchema.parse(game);
    });

    res.status(200).json(validatedGames);
  } catch (error) {
    console.error(error); // TODO: Edit error message
    res.status(500).json({ message: "Internal server error" }); // TODO: Edit error message
  }
});

/**
 * Retrieves a single game by its ID.
 * @param {string} req.params.id - The ID of the game to retrieve.
 * @returns {Object} - The game data.
 * @throws {Error} - If the game is not found or validation fails.
 */
router.get("/:id", async (req, res) => {
  try {
    const id = gameIdSchema.parse(req.params.id);

    const [game] = await db
      .select({
        id: games.id,
        name: games.name,
        isPublic: games.isPublic,
        data: games.data,
        userId: games.userId,
        author: user.name,
      })
      .from(games)
      .innerJoin(user, eq(games.userId, user.id))
      .where(eq(games.id, id));

    if (!game) {
      res.status(404).json({ error: "Game not found" }); // TODO: error message
      return;
    }
    const validatedGame = gameSelectSchema.parse(game);
    const gameWithAuthor = { ...validatedGame, author: game.author };

    res.status(200).json(gameWithAuthor);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid game ID format", // TODO: error message
        documentation_url: `${ORIGIN}/api/#tag/games/GET/games/{id}`,
      });
    } else {
      console.error(error); // TODO: Edit error message
      res.status(500).json({ message: "Internal server error" }); // TODO: Edit error message
    }
  }
});

/**
 * Updates an existing game by its ID.
 * @param {string} req.params.id - The ID of the game to update.
 * @param {Object} req.body - The fields to update on the game.
 * @returns {Object} - The updated game data.
 * @throws {Error} - If the game is not found or validation fails.
 */
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const id = gameIdSchema.parse(req.params.id);
    const userId = req.session!.user.id;

    // Check if game exists
    const [game] = await db.select().from(games).where(eq(games.id, id));
    if (!game) {
      res.status(404).json({ error: "Game not found" }); // TODO: error message
      return;
    }

    // Check if user owns the game
    if (game.userId !== userId) {
      res.status(403).json({
        error: "Forbidden: You do not have permission to modify this game", // TODO: error message
      });
      return;
    }

    const updates = gameUpdateSchema.parse(req.body);
    if (Object.keys(updates).length === 0) {
      res.status(200).json(game);
      return;
    }

    const [updatedGame] = await db
      .update(games)
      .set(updates)
      .where(eq(games.id, id))
      .returning();

    res.status(200).json(updatedGame);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid game data for update", // TODO: error message
        documentation_url: `${ORIGIN}/api/#tag/games/PATCH/games/{id}`,
      });
    } else {
      console.error(error); // TODO: Edit error message
      res.status(500).json({ message: "Internal server error" }); // TODO: Edit error message
    }
  }
});

/**
 * Deletes a game by its ID.
 * @param {string} req.params.id - The ID of the game to delete.
 * @returns {string} - Status code 204 indicating successful deletion.
 * @throws {Error} - If the game is not found or user does not have permission.
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const id = gameIdSchema.parse(req.params.id);
    const userId = req.session!.user.id;

    const [game] = await db.select().from(games).where(eq(games.id, id));
    if (!game) {
      res.status(404).json({ error: "Game not found" }); // TODO: Edit error message
      return;
    }

    if (game.userId !== userId) {
      res.status(403).json({
        error: "Forbidden: You do not have permission to delete this game",
      }); // TODO: Edit error message
      return;
    }

    await db.delete(games).where(eq(games.id, id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid game ID format", // TODO: Edit error message
        documentation_url: `${ORIGIN}/api/#tag/games/DELETE/games/{id}`,
      });
    } else {
      console.error("Error deleting game:", error); // TODO: Edit error message
      res.status(500).json({ message: "Internal server error" }); // TODO: Edit error message
    }
  }
});

export default router;
