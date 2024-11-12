import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import process from "node:process";

const db = drizzle(process.env.DATABASE_URL!);