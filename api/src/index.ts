import "dotenv/config";
import path from "path";
import cors from "cors";
import express from "express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "@/lib/auth";

import { apiReference } from "@scalar/express-api-reference";

import gameRoutes from "./routes/games";
import inviteRoutes from "./routes/invite";

const app = express();
const port = 8000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(
  cors({
    origin: isProduction ? `https://${process.env.DOMAIN}` : `http://localhost`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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

app.all("/api/auth/*", toNodeHandler(auth));
app.use("/api/games", express.json(), gameRoutes);
app.use("/api/invite", express.json(), inviteRoutes);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
