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
    <article className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <h3
          className={`text-base font-semibold ${
            done ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            done
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {task.status}
        </span>
      </header>
      {task.description && (
        <p className="text-sm text-gray-600">{task.description}</p>
      )}
      <p className="text-xs text-gray-500">Due: {formatDate(task.dueDate)}</p>
      <div className="mt-2 flex gap-2">
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
