import "dotenv/config";
import express from "express";

import authRoutes from "./routes/auth";
import gameRoutes from "./routes/games";
import inviteRoutes from "./routes/invite";

const app = express();
const port = 8000;

app.get("/api", (req, res) => {
  // TODO: OPEN API SPEC
  res.send({ message: "Hello World!" });
});

app.use("/api/auth", express.json(), authRoutes);
app.use("/api/games", express.json(), gameRoutes);
app.use("/api/invite", express.json(), inviteRoutes);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
