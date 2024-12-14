import { auth } from "@/lib/auth"; // or wherever the session type is defined

type Session = typeof auth.$Infer.Session;

declare global {
  namespace Express {
    interface Request {
      session: Session | null;
    }
  }
}
