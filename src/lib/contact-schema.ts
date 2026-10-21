import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please tell us your name").max(120),
  email: z.string().email("That email doesn't look right"),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(10, "Give us a little more to go on").max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;
