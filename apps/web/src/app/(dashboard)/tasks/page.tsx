'use client';

import { useState } from 'react';
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

export default function TasksPage() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const limit = 5;
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
    <section className="flex flex-col gap-5">
      <header className="panel-enter rounded-2xl border border-amber-200/70 bg-[var(--surface)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My tasks</h1>
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm text-gray-600">
            Filter:
            </label>
            <select
              id="filter"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StatusFilter);
                setPage(1);
              }}
              className="rounded-lg border border-amber-200 bg-[var(--surface)] px-2 py-1 text-sm outline-none focus:border-teal-700"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
            <Button onClick={() => setCreating(true)}>New task</Button>
          </div>
        </div>
      </header>

      {creating && (
        <div className="panel-enter rounded-2xl border border-amber-200/70 bg-[var(--surface)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
          <h2 className="mb-3 text-lg font-semibold">Create task</h2>
          <TaskForm
            submitting={createTask.isPending}
            onSubmit={(values) =>
              createTask.mutate(values, {
                onSuccess: () => setCreating(false),
              })
            }
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      {editing && (
        <div className="panel-enter rounded-2xl border border-amber-200/70 bg-[var(--surface)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
          <h2 className="mb-3 text-lg font-semibold">Edit task</h2>
          <TaskForm
            initial={editing}
            submitting={updateTask.isPending}
            onSubmit={(values) =>
              updateTask.mutate(
                { id: editing.id, input: values },
                { onSuccess: () => setEditing(null) },
              )
            }
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {tasksQuery.isLoading && (
        <p className="text-sm text-gray-500">Loading tasks…</p>
      )}
      {tasksQuery.isError && (
        <p role="alert" className="text-sm text-red-600">
          {(tasksQuery.error as Error).message}
        </p>
      )}

      {data && data.items.length === 0 && (
        <p className="text-sm text-gray-500">No tasks yet.</p>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {data?.items.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(t) => setEditing(t)}
            onDelete={(t) => {
              if (confirm(`Delete "${t.title}"?`)) deleteTask.mutate(t.id);
            }}
            onToggleStatus={(t) =>
              toggle.mutate({
                id: t.id,
                status: t.status === 'done' ? 'pending' : 'done',
              })
            }
            busy={
              deleteTask.isPending ||
              toggle.isPending ||
              updateTask.isPending
            }
          />
        ))}
      </div>

      {data && data.total > data.limit && (
        <nav className="flex items-center justify-between pt-2 text-sm">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-gray-700">
            Page {data.page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </nav>
      )}
    </section>
  );
}
