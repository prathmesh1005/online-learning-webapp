import { 
  pgTable, 
  serial, 
  integer, 
  varchar, 
  boolean, 
  json 
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(), // ✅ Works with Drizzle + Neon
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscriptionId: varchar("subscription_id", { length: 255 }),
});

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(), // ✅
  cid: varchar("cid", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  description: varchar("description", { length: 255 }),
  noOfChapters: integer("noOfChapters").notNull(),
  includeVideos: boolean("includeVideos").default(false),
  level: varchar("level", { length: 255 }).notNull(),
  category: varchar("catetgory", { length: 255 }),
  courseJson: json("courseJson"),
  userEmail: varchar("userEmail", { length: 255 }).references(() => usersTable.email),
});
