import { uuid, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const gamesTable = pgTable("games", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  data: json(),
});