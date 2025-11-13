import { object, string, z } from 'zod';


export const createSessionSchema = object({
  body: object({
     mobno: z
      .string({ error: "Mobile number is required" })
      .regex(/^[6-9]\d{9}$/, "Invalid mobile number. Must start with 6-9 and be 10 digits long"),
    password: string()
      .min(6, "Password too short - should be at least 6 characters")
})
});


