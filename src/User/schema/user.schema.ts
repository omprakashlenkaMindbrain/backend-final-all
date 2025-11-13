import { z } from "zod";


export const createUserSchema = z.object({
  body: z
    .object({
      name: z
        .string({ error: "Name is required" })
        .regex(/^[A-Za-z\s]+$/, "Only alphabets and spaces allowed"),

      email: z
        .string({ error: "Email is required" })
        .email("Invalid email format"),

      mobno: z
        .string({ error: "Mobile number is required" })
        .regex(/^[6-9]\d{9}$/, "Invalid mobile number — must start with 6–9 and be 10 digits"),

      password: z
        .string({ error: "Password is required" })
        .min(6, "Password too short — should be at least 6 characters long"),

      // Optional referral / tracking fields
      trackingId: z.string().regex(/^BLO\d+$/, "Invalid referral ID format (e.g., BLO0001)").optional().nullable(),

    
    })
    .strict(),
});


export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
