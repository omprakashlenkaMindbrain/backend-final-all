// src/schema/user.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string({ error: "Name is required" }),
   }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
