import express, { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createSelectSchema,
  createInsertSchema,
} from "drizzle-zod";
import { db, games, invites } from "@db";
import { authenticate } from "@lib";
import { ORIGIN } from "@config";

const gameSelectSchema = createSelectSchema(games);
const inviteSelectSchema = createSelectSchema(invites);
const inviteInsertSchema = createInsertSchema(invites).strict();
const gameIdSchema = z.string().uuid();
const inviteIdSchema = z.string().uuid();
const expirationSchema = z.number();

const inviteRequestSchema = z
  .object({
    gameId: gameIdSchema,
    expiration: expirationSchema,
  })
  .strict();

const router = express.Router();

router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    // Validate input
    const { gameId, expiration } = inviteRequestSchema.parse(req.body);
    const userId = req.session!.user.id;

    // Ensure game exists
    const [game] = await db.select().from(games).where(eq(games.id, gameId));
    if (!game) {
      res.status(404).json({ message: "Game not found" }); // TODO: Change error message
      return;
    }

    // Ensure game belongs to the current user
    const validatedGame = gameSelectSchema.parse(game);
    if (validatedGame.userId !== userId) {
      res.status(403).json({ message: "Unauthorized to invite for this game" }); // TODO: Change error message
      return;
    }

    // Get the expiration date
    const expirationDate = new Date(Date.now() + expiration * 1000);

    // TODO: Allow for persistent invites

    // Insert the newly created invite into the database
    const validatedInvite = inviteInsertSchema.parse({
      userId,
      gameId,
      expiration: expirationDate,
    });
    const [newInvite] = await db
      .insert(invites)
      .values(validatedInvite)
      .returning({ id: invites.id });

    // // Return the invite
    res.status(201).json(`${ORIGIN}/invite/${newInvite.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid invite content", // TODO: Error message
        documentation_url: `${ORIGIN}/api/#tag/invite/POST/invite`,
      });
    } else {
      console.error(error); // TODO: Edit error message
      res.status(500).json({ message: "Internal server error" }); // TODO: Edit error message
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = inviteIdSchema.parse(req.params.id);

    const [invite] = await db.select().from(invites).where(eq(invites.id, id));

    if (!invite) {
      res.status(404).json({ message: "Invite not found" }); // TODO: CHANGE ERROR MESSAGE
      return;
    }

    const validatedInvite = inviteSelectSchema.parse(invite);

    const currentTime = new Date();
    if (currentTime > validatedInvite.expiration) {
      // Delete the expired invite from the database
      await db.delete(invites).where(eq(invites.id, id));
      res.status(410).json({ message: "Invite has expired" }); // TODO: CHANGE ERROR MESSAGE
      return;
    }

    res.status(200).json({ gameId: invite.gameId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid ID format", // TODO: Error message
        documentation_url: `${ORIGIN}/api/#tag/invite/GET/invite`,
      });
    } else {
      console.error(error); // TODO: Edit error message
      res.status(500).json({ message: "Internal server error" }); // TODO: Edit error message
    }
  }
});

export default router;
