'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Save, Plus, X } from 'lucide-react';
import { TaskFormSchema, type Task, type TaskFormInput } from '@/lib/schemas';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Props {
  initial?: Task | null;
  submitting?: boolean;
  onSubmit: (values: TaskFormInput) => void;
  onCancel?: () => void;
}

function toFormInput(task?: Task | null): TaskFormInput {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'pending',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  };
}

export function TaskForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInput>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: toFormInput(initial),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
      noValidate
    >
      <Input
        label="Título"
        error={errors.title?.message}
        {...register('title')}
      />
      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-sm font-medium"
          style={{ color: 'var(--charcoal)' }}
        >
          Descripción
        </label>
        <textarea
          id="description"
          rows={3}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-muted)]"
          {...register('description')}
        />
        {errors.description?.message && (
          <span className="text-xs text-red-600">
            {errors.description.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
          Estado
        </label>
        <select
          id="status"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-muted)]"
          {...register('status')}
        >
          <option value="pending">Pendiente</option>
          <option value="done">Completada</option>
        </select>
      </div>
      <Input
        label="Fecha de vencimiento"
        type="date"
        error={errors.dueDate?.message}
        {...register('dueDate')}
      />
      <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex items-center gap-1.5">
            <X size={14} />
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting} className="flex items-center gap-1.5">
          {submitting ? 'Guardando…' : initial ? <><Save size={14} /> Guardar cambios</> : <><Plus size={14} /> Crear tarea</>}
        </Button>
      </div>
    </form>
  );
}
