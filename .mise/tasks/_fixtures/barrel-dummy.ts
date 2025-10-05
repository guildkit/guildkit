import { pgTable, uuid } from "drizzle-orm/pg-core";

export const dummy = pgTable("dummy", {
  id: uuid().primaryKey().notNull().defaultRandom(),
});
