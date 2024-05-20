import { z } from "zod";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z.object({
  name: z.string().trim().min(1, "Name must be at least 1 character long").max(100),
  ownerName: z.string().trim().min(1, "Name must be at least 1 character long").max(100),
  imageUrl: z.string().trim().url({ message: "Image URL must be a valid URL" }),
  age: z.coerce.number().int().positive().max(99),
  notes: z.union([z.literal(""), z.string().trim().max(100)]),
});

export type TPetForm = z.infer<typeof petFormSchema>;

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TAuth = z.infer<typeof authSchema>;
