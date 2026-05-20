import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(120).trim(),
});
export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1).max(72),
});
export type LoginDto = z.infer<typeof LoginSchema>;
