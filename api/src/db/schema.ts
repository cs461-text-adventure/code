import { uuid, pgTable, text, json, timestamp } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  data: json().notNull(),
});

export const invites = pgTable("invites", {
  id: uuid().defaultRandom().primaryKey(),
  gameId: uuid().notNull().references(() => games.id),
  expiration: timestamp().notNull(),
});