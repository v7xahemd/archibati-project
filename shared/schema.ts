import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  secretCode: text("secret_code").notNull(),
});

export const progressSteps = pgTable("progress_steps", {
  id: serial("id").primaryKey(),
  projectId: serial("project_id").references(() => projects.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects);
export const insertProgressSchema = createInsertSchema(progressSteps);

export const clientLoginSchema = z.object({
  clientName: z.string().min(1),
  secretCode: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProgressStep = typeof progressSteps.$inferSelect;
export type ClientLogin = z.infer<typeof clientLoginSchema>;
