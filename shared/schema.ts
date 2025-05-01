import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main users table for storing user registration information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userGroup: text("user_group").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Responses table for storing form answers
export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  
  // Page 2: Team Collaboration
  question1: text("question1"), // A or B
  question1b: text("question1b"), // 1, 2, or 3 (only if question1 is B)
  
  // Page 3: Client Communication
  question2: text("question2"), // A or B
  question2b: text("question2b"), // 1, 2, or 3 (only if question2 is B)
  
  // Page 4: Design-to-Development Handoff
  question3: text("question3"), // A or B
  question3b: text("question3b"), // 1, 2, or 3 (only if question3 is B)
  
  // Page 5: Design System Management
  question4: text("question4"), // A or B
  question4b: text("question4b"), // 1, 2, or 3 (only if question4 is B)
  
  // Page 6: Data-Informed Design
  question5: text("question5"), // A or B
  question5b: text("question5b"), // 1, 2, or 3 (only if question5 is B)
  
  completedAt: timestamp("completed_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true
});

export const insertResponseSchema = createInsertSchema(responses).omit({ 
  id: true, 
  completedAt: true 
});

// Form data schema (combines user and responses)
export const formDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userGroup: z.string().min(1, "Please select a group"),
  
  // Form questions
  question1: z.string().optional(),
  question1b: z.string().optional(),
  question2: z.string().optional(),
  question2b: z.string().optional(),
  question3: z.string().optional(),
  question3b: z.string().optional(),
  question4: z.string().optional(),
  question4b: z.string().optional(),
  question5: z.string().optional(),
  question5b: z.string().optional(),
});

// Form page schema for validation
export const registrationSchema = formDataSchema.pick({ 
  name: true, 
  userGroup: true 
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type User = typeof users.$inferSelect;
export type Response = typeof responses.$inferSelect;
export type FormData = z.infer<typeof formDataSchema>;
export type RegistrationData = z.infer<typeof registrationSchema>;

// Combined Response Type (for CSV export)
export type FormSubmission = {
  id: number;
  name: string;
  userGroup: string;
  fileName: string;
  question1?: string;
  question1b?: string;
  question2?: string;
  question2b?: string;
  question3?: string;
  question3b?: string;
  question4?: string;
  question4b?: string;
  question5?: string;
  question5b?: string;
  completedAt: Date;
};
