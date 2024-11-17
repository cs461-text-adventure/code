import "dotenv/config";
import express from "express";
import gameRoutes from "./routes/games";

const app = express();
const port = 8000;

app.get("/api", (req, res) => {
  // TODO: OPEN API SPEC
  res.send({ message: "Hello World!" });
});

app.use("/api/games", express.json(), gameRoutes);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
