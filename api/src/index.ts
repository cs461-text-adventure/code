import "dotenv/config";
import path from 'path';
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";

import { apiReference } from '@scalar/express-api-reference'

import gameRoutes from "./routes/games";
import inviteRoutes from "./routes/invite";

const app = express();
const port = 8000;

app.get("/api", (req, res) => {
  // TODO: OPEN API SPEC
  res.send({ message: "Hello World!" });
});

app.get("/api/openapi", (req, res) => {
  // TODO: OPEN API SPEC
  const filePath = path.resolve(__dirname, './openapi.yaml');
  res.sendFile(filePath);
});

app.use(
  '/api/reference',
  apiReference({
    theme: "default",
    spec: {
      // Put your OpenAPI url here:
      url: '/api/openapi',
    },
  }),
)

app.all("/api/auth/*", toNodeHandler(auth));
app.use("/api/games", express.json(), gameRoutes);
app.use("/api/invite", express.json(), inviteRoutes);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
