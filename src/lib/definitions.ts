import { z } from 'zod';

export const LoginSchema = z.object({
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginState =
  | { errors: { password?: string[] }; message?: string }
  | undefined;
