import { unique } from "drizzle-orm/gel-core";
import { 
  pgTable, 
  integer, 
  varchar, 
  boolean, 
  json
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscriptionId: varchar("subscription_id", { length: 255 }),
});

export const coursesTable = pgTable("courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar("cid").notNull().unique(),
  name: varchar("name", { length: 255 }),
  description: varchar("description", { length: 255 }),
  noOfChapters: integer("no_of_chapters").notNull(),
  includeVideos: boolean("include_videos").default(false),
  level: varchar("level", { length: 255 }).notNull(),
  category: varchar("catetgory", { length: 255 }), // Match the actual database column name
  courseJson: json("course_json"),
  userEmail: varchar("user_email", { length: 255 }).references(() => usersTable.email),
  bannerImageURL: varchar("banner_image_url", { length: 255 }),
  courseContent: json().default({}),
})

export const enrollCourseTable=pgTable('enrollCourse',{
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    cid:varchar('cid').references(()=>coursesTable.cid),
    userEmail: varchar('userEmail').references(()=> usersTable.email).notNull(),
    completedChapters:json()

})
