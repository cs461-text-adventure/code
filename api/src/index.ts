import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.ts";
import morgan from 'morgan';

import gameRoutes from './routes/games.ts';
 
const app = express();
const port = 8000;

app.use(morgan('combined'));
 
app.get("/api", (req, res) => {
  // TODO: OPEN API SPEC
  res.send({ "message": "Hello World!" });
});

app.use('/api/games', express.json(), gameRoutes);

app.all("/api/auth/*", toNodeHandler(auth));



app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}/api`);
});