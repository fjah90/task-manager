import { z } from 'zod';

export const TaskStatusSchema = z.enum(['pending', 'done']);
export type TaskStatusValue = z.infer<typeof TaskStatusSchema>;

const isoDate = z
  .string()
  .datetime({ offset: true })
  .or(z.string().date())
  .transform((v) => new Date(v));

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).trim().optional().nullable(),
  status: TaskStatusSchema.optional().default('pending'),
  dueDate: isoDate.optional().nullable(),
});
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z
  .object({
    title: z.string().min(1).max(200).trim().optional(),
    description: z.string().max(2000).trim().optional().nullable(),
    status: TaskStatusSchema.optional(),
    dueDate: isoDate.optional().nullable(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: 'At least one field is required',
  });
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;

export const ListTasksQuerySchema = z.object({
  status: TaskStatusSchema.optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});
export type ListTasksQuery = z.infer<typeof ListTasksQuerySchema>;
