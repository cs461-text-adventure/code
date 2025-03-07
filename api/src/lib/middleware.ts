import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@/lib/auth";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Try better-auth session first
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.session = session;
      next();
      return;
    }

    // Check for mock session
    const sessionCookie = req.cookies?.session;
    if (sessionCookie) {
      try {
        const mockSession = JSON.parse(sessionCookie);
        if (mockSession?.user?.id) {
          req.session = {
            session: {
              id: 'mock-session-id',
              createdAt: new Date(),
              updatedAt: new Date(),
              userId: mockSession.user.id,
              expiresAt: new Date(mockSession.expiresAt),
              token: mockSession.token,
            },
            user: mockSession.user,
          };
          next();
          return;
        }
      } catch (e) {
        console.error('Error parsing mock session:', e);
      }
    }

    res.status(401).json({ error: "Unauthorized" });
    return;
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
