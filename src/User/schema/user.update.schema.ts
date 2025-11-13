import { z } from "zod";

export const updateUserSchema = z.object({
  body: z
    .object({
      // ✅ Editable user fields only
      name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .optional(),

      email: z
        .string()
        .email("Invalid email address")
        .optional(),

      mobno: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid mobile number. Must start with 6-9 and be 10 digits long")
        .optional(),

      // ✅ KYC fields
      adhara_img: z
        .string()
        .url("Invalid Aadhaar image URL")
        .optional(),

      pan_img: z
        .string()
        .url("Invalid PAN image URL")
        .optional(),

      // ✅ Plan info
      plan_name: z
        .string()
        .min(2, "Plan name must be at least 2 characters")
        .optional(), // made optional to allow partial updates

      payment_cs: z
        .string()
        .optional(),
    })
    .strict() // 🚫 reject unexpected fields for better security
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
