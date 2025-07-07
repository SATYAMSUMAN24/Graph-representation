import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const charts = pgTable("charts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  chartType: text("chart_type").notNull(),
  xAxisLabel: text("x_axis_label"),
  yAxisLabel: text("y_axis_label"),
  colorTheme: text("color_theme").default("blue"),
  data: jsonb("data").notNull(),
  options: jsonb("options").default({}),
  createdAt: text("created_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChartSchema = createInsertSchema(charts).pick({
  title: true,
  chartType: true,
  xAxisLabel: true,
  yAxisLabel: true,
  colorTheme: true,
  data: true,
  options: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChart = z.infer<typeof insertChartSchema>;
export type Chart = typeof charts.$inferSelect;
