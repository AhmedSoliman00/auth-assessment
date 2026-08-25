import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Email must be valid'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      'Password must contain at least one letter, one number, and one special character',
    ),
});

export type SignupFormData = z.infer<typeof signupSchema>;
