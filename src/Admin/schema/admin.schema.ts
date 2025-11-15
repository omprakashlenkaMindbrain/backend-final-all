// src/schema/user.schema.ts
import { z } from "zod";

export const createAdminSchema = z.object({
  body: z.object({
    name: z.string({ error: "Name is required" }).regex(/^[A-Za-z\s]+$/, "Only alphabets allowed"),
    email: z.string({ error: "Email is required" }).email("Not a valid email"),
     mobno: z
      .string({ error: "Mobile number is required" })
      .regex(/^[6-9]\d{9}$/, "Invalid mobile number. Must start with 6-9 and be 10 digits long"),
    
    password: z.string({ error: "Password is required" }).min(6, "Password too short - should be 6 chars minimum"),
  }),
});


export type CreateAdminInput = z.infer<typeof createAdminSchema>["body"]