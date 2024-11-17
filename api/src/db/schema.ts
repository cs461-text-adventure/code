import { uuid, pgTable, text, json } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  data: json().notNull(),
});
