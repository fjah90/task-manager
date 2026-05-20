import { z } from 'zod';

export const TaskStatusSchema = z.enum(['pending', 'done']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required').max(72),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const TaskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  status: TaskStatusSchema,
  dueDate: z.string().optional(),
});
export type TaskFormInput = z.infer<typeof TaskFormSchema>;

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTasks {
  items: Task[];
  page: number;
  limit: number;
  total: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}
