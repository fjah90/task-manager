'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api-client';
import type {
  PaginatedTasks,
  Task,
  TaskFormInput,
  TaskStatus,
} from '@/lib/schemas';

export interface ListParams {
  status?: TaskStatus | 'all';
  page: number;
  limit: number;
}

const tasksKey = (params: ListParams) => ['tasks', params] as const;

export function useTasks(params: ListParams) {
  const qs = new URLSearchParams();
  qs.set('page', String(params.page));
  qs.set('limit', String(params.limit));
  if (params.status && params.status !== 'all') qs.set('status', params.status);

  return useQuery({
    queryKey: tasksKey(params),
    queryFn: () => apiFetch<PaginatedTasks>(`/tasks?${qs.toString()}`),
  });
}

function toPayload(input: TaskFormInput) {
  return {
    title: input.title,
    description: input.description?.trim() ? input.description : null,
    status: input.status,
    dueDate: input.dueDate ? input.dueDate : null,
  };
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskFormInput) =>
      apiFetch<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(toPayload(input)),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarea creada');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskFormInput }) =>
      apiFetch<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(toPayload(input)),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarea actualizada');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarea eliminada');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useToggleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      apiFetch<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(vars.status === 'done' ? 'Tarea completada ✓' : 'Tarea marcada como pendiente');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
