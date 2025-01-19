import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@/lib/auth";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" }); // TODO: EDIT ERROR MESSAGE
      return;
    }

    // Attach the session to the request
    req.session = session;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal Server Error" }); // TODO: EDIT ERROR MESSAGE
    return;
  }
};
