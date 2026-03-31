import {z} from 'zod';

export const signUpSchema = z.object({
    username: z.string().min(3).max(20).trim(),
    email: z.email().max(255).trim().lowercase(),
    password: z.string().min(6).max(128),
    role: z.enum(['user', 'admin']).default('user')
});

export const signInSchema = z.object({
    email: z.email().trim().lowercase(),
    password: z.string().min(1)
});