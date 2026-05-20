'use client';

import type { Task } from '@/lib/schemas';
import { Button } from '@/components/Button';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  busy?: boolean;
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus, busy }: Props) {
  const done = task.status === 'done';
  return (
    <article className="panel-enter flex flex-col gap-3 rounded-2xl border border-amber-200/70 bg-[var(--surface)] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <header className="flex items-start justify-between gap-2">
        <h3
          className={`text-base font-semibold tracking-tight ${
            done ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
            done
              ? 'bg-teal-100 text-teal-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {task.status}
        </span>
      </header>
      {task.description && (
        <p className="text-sm leading-relaxed text-gray-600">{task.description}</p>
      )}
      <p className="text-xs font-medium text-gray-500">Due: {formatDate(task.dueDate)}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => onToggleStatus(task)}
          disabled={busy}
        >
          Mark {done ? 'pending' : 'done'}
        </Button>
        <Button variant="ghost" onClick={() => onEdit(task)} disabled={busy}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(task)} disabled={busy}>
          Delete
        </Button>
      </div>
    </article>
  );
}
