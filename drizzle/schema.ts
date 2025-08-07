import { pgTable, unique, integer, varchar, boolean, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	subscriptionId: varchar("subscription_id"),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const courses = pgTable("courses", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "courses_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	cid: varchar().notNull(),
	name: varchar(),
	description: varchar(),
	noOfChapters: integer().notNull(),
	includeVideos: boolean().default(false),
	level: varchar().notNull(),
	catetgory: varchar(),
	courseJson: json(),
	userEmail: varchar(),
	bannerImageURL: varchar().default('')
});
