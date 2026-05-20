'use client';

import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '@/lib/schemas';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  busy?: boolean;
}

function formatDate(value: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus, busy }: Props) {
  const done = task.status === 'done';
  return (
    <li className="group flex items-center gap-3 px-4 py-3 transition hover:bg-[var(--brand-muted)]">
      <button
        onClick={() => onToggleStatus(task)}
        disabled={busy}
        className="shrink-0 cursor-pointer transition hover:scale-110 disabled:opacity-50"
        aria-label={done ? 'Marcar pendiente' : 'Marcar completada'}
      >
        {done
          ? <CheckCircle2 size={22} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
          : <Circle size={22} strokeWidth={1.8} style={{ color: 'var(--border-strong)' }} />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            done ? 'line-through opacity-40' : ''
          }`}
          style={{ color: 'var(--foreground)' }}
        >
          {task.title}
        </p>
        {(task.description || task.dueDate) && (
          <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--charcoal)', opacity: 0.55 }}>
            {task.description ?? ''}
            {task.description && task.dueDate ? ' · ' : ''}
            {task.dueDate ? `Vence ${formatDate(task.dueDate)}` : ''}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          disabled={busy}
          className="cursor-pointer rounded-lg p-1.5 transition hover:bg-[var(--surface-alt)] disabled:opacity-50"
          aria-label="Editar"
        >
          <Pencil size={14} style={{ color: 'var(--charcoal)' }} />
        </button>
        <button
          onClick={() => onDelete(task)}
          disabled={busy}
          className="cursor-pointer rounded-lg p-1.5 transition hover:bg-red-50 disabled:opacity-50"
          aria-label="Eliminar"
        >
          <Trash2 size={14} style={{ color: 'var(--danger)' }} />
        </button>
      </div>
    </li>
  );
}
