export const DOMAIN = process.env.DOMAIN || "localhost";
export const isProduction = process.env.NODE_ENV === "production";
export const ORIGIN = isProduction
  ? `https://${process.env.DOMAIN}`
  : `http://localhost:8000`;
