'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
        label="Title"
        error={errors.title?.message}
        {...register('title')}
      />
      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          {...register('description')}
        />
        {errors.description?.message && (
          <span className="text-xs text-red-600">
            {errors.description.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
          {...register('status')}
        >
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>
      <Input
        label="Due date"
        type="date"
        error={errors.dueDate?.message}
        {...register('dueDate')}
      />
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}
