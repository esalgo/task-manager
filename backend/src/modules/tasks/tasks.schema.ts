import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (YYYY-MM-DD)'),
  priority: z.enum(['Alta', 'Media', 'Baja']),
  status: z.enum(['Pendiente', 'Progreso', 'Completada']),
  description: z.string(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
