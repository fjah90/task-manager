'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import { Plus, ChevronLeft, ChevronRight, ListChecks } from 'lucide-react';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleStatus,
} from '@/features/tasks/hooks';
import { TaskCard } from '@/features/tasks/TaskCard';
import { TaskForm } from '@/features/tasks/TaskForm';
import { Button } from '@/components/Button';
import type { Task, TaskStatus } from '@/lib/schemas';

type StatusFilter = TaskStatus | 'all';

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Completadas', value: 'done' },
];

export default function TasksPage() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [editing, setEditing] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);

  const tasksQuery = useTasks({ status, page, limit });
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggle = useToggleStatus();

  const data = tasksQuery.data;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="mx-auto w-full max-w-lg pb-10">
      {/* Title + count */}
      <div className="flex items-center gap-2 px-1 py-4">
        <ListChecks size={18} style={{ color: 'var(--brand)' }} />
        <span className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
          Mis tareas
        </span>
        {data && (
          <span
            className="rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ background: 'var(--brand-muted)', color: 'var(--brand-darker)' }}
          >
            {data.total}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 border-b border-[var(--border)]">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setStatus(f.value); setPage(1); }}
            className={`cursor-pointer border-b-2 px-4 pb-2 pt-1 text-sm font-medium transition ${
              status === f.value
                ? 'border-[var(--brand)]'
                : 'border-transparent opacity-50 hover:opacity-80'
            }`}
            style={{ color: status === f.value ? 'var(--brand-darker)' : 'var(--charcoal)' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Form panel */}
      {(creating || editing) && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_6px_24px_rgba(0,196,178,0.08)]">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-darker)' }}>
            {editing ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <TaskForm
            initial={editing}
            submitting={editing ? updateTask.isPending : createTask.isPending}
            onSubmit={(values) => {
              if (editing) {
                updateTask.mutate(
                  { id: editing.id, input: values },
                  { onSuccess: () => setEditing(null) },
                );
              } else {
                createTask.mutate(values, { onSuccess: () => setCreating(false) });
              }
            }}
            onCancel={() => { setCreating(false); setEditing(null); }}
          />
        </div>
      )}

      {/* Task list container */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_4px_16px_rgba(0,196,178,0.06)]">
        {tasksQuery.isLoading && (
          <p className="px-4 py-8 text-center text-sm" style={{ color: 'var(--charcoal)', opacity: 0.5 }}>Cargando tareas…</p>
        )}
        {tasksQuery.isError && (
          <p role="alert" className="px-4 py-8 text-center text-sm" style={{ color: 'var(--danger)' }}>
            {(tasksQuery.error as Error).message}
          </p>
        )}
        {data && data.items.length === 0 && (
          <p className="px-4 py-10 text-center text-sm" style={{ color: 'var(--charcoal)', opacity: 0.4 }}>Aún no hay tareas.</p>
        )}
        {data && data.items.length > 0 && (
          <ul className="divide-y divide-[var(--border)]">
            {data.items.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => { setEditing(t); setCreating(false); }}
                onDelete={async (t) => {
                  const result = await Swal.fire({
                    title: '¿Eliminar tarea?',
                    text: `"${t.title}" se eliminará permanentemente.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#e74c3c',
                    cancelButtonColor: '#6c757d',
                    background: 'var(--surface)',
                    color: 'var(--foreground)',
                  });
                  if (result.isConfirmed) deleteTask.mutate(t.id);
                }}
                onToggleStatus={(t) =>
                  toggle.mutate({ id: t.id, status: t.status === 'done' ? 'pending' : 'done' })
                }
                busy={deleteTask.isPending || toggle.isPending || updateTask.isPending}
              />
            ))}
          </ul>
        )}

        {/* + Agregar tarea */}
        {!creating && !editing && (
          <button
            onClick={() => { setCreating(true); setEditing(null); }}
            className="flex w-full cursor-pointer items-center gap-3 border-t border-[var(--border)] px-4 py-3 text-sm transition hover:bg-[var(--brand-muted)]"
            style={{ color: 'var(--brand-dark)' }}
          >
            <Plus size={16} />
            <span className="font-medium">Agregar tarea</span>
          </button>
        )}
      </div>

      {/* Pagination */}
      {data && data.total > data.limit && (
        <nav className="mt-4 flex items-center justify-between text-sm">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Anterior
          </Button>
          <span className="text-xs" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>
            {data.page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1"
          >
            Siguiente <ChevronRight size={16} />
          </Button>
        </nav>
      )}
    </div>
  );
}
