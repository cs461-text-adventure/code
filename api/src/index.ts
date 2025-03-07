import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiReference } from "@scalar/express-api-reference";
import { auth } from "@/lib/auth";
import gamesRouter from "@/routes/games";

const app = express();
const port = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: isProduction ? `https://${process.env.DOMAIN}` : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Cookie", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// API Documentation
app.get("/api/openapi", (req, res) => {
  const filePath = path.resolve(__dirname, "./openapi.yaml");
  res.sendFile(filePath);
});

app.get(
  "/api/",
  apiReference({
    theme: "saturn",
    metaData: {
      title: "Text Adventure API",
    },
    spec: {
      url: isProduction ? "/openapi" : "/api/openapi",
    },
  }),
);

// Routes
app.use("/api/games", gamesRouter);

// Start server
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
