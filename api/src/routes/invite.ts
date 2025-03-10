import express, { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { games, invites } from "@/db/schema";
import { authenticate } from "@/lib/middleware";

const isProduction = process.env.NODE_ENV === "production";
const origin = isProduction ? `https://${process.env.DOMAIN}` : `http://localhost`;
const router = express.Router();

router.post("/", authenticate, async (req: Request, res: Response) => {
  // Get the user session:
  const session = req.session;
  const userId = session!.user.id;

  const { gameId, expiration } = req.body;

  // TODO: Validate the input
  if (!gameId || !expiration) {
    res.status(400).json({ message: "Game and expiry are required" }); // TODO: Change error message
    return;
  }

  // Ensure game exists and belongs to the current user
  const game = await db.select().from(games).where(eq(games.id, gameId));
  if (!game.length || game[0].userId != userId) {
    res.status(403).json({ message: "Unauthorized" }); // TODO: Change error message
    return;
  }

  // Get the expiration date
  const currentTime = new Date();
  const expirationDate = new Date(currentTime.getTime() + expiration * 1000);

  // TODO: Allow for persistent invites

  // Insert the newly created invite into the database
  const invite: typeof invites.$inferInsert = {
    gameId,
    expiration: expirationDate,
    userId,
  };
  const inviteId = (
    await db.insert(invites).values(invite).returning({ id: invites.id })
  )[0].id;

  // Return the invite
  res.status(201).json(`${origin}/invite/${inviteId}`);
});

router.get("/:id", async (req, res) => {
  // TODO: ADD INPUT VALIDATION

  const id = req.params.id;

  // Validate input
  if (!id) {
    res.status(400).json({ error: "Invalid invite ID" }); // TODO: CHANGE ERROR MESSAGE
    return;
  }

  const inviteResult = await db
    .select()
    .from(invites)
    .where(eq(invites.id, id));
  const invite = inviteResult[0];

  if (!invite) {
    res.status(404).json({ error: "invite not found" }); // TODO: CHANGE ERROR MESSAGE
    return;
  }

  const currentTime = new Date();
  if (currentTime > invite.expiration) {
    // Delete the expired invite from the database
    await db.delete(invites).where(eq(invites.id, id));
    res.status(410).json({ error: "invite has expired" }); // TODO: CHANGE ERROR MESSAGE
    return;
  }

  res.send({ gameId: invite.gameId });
});

export default router;
