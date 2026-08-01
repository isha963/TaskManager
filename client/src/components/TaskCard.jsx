import { Link } from "react-router-dom";

const priorityStyles = {
  High: "bg-rose-50 text-rose-700 ring-rose-100",
  Medium: "bg-amber-50 text-amber-800 ring-amber-100",
  Low: "bg-emerald-50 text-emerald-800 ring-emerald-100",
};

const statusStyles = {
  Todo: "bg-slate-100 text-slate-700",
  "In Progress": "bg-sky-50 text-sky-800",
  Done: "bg-teal-50 text-teal-800",
};

export default function TaskCard({ task }) {
  const priorityClass =
    priorityStyles[task.priority] ?? "bg-slate-100 text-slate-600 ring-slate-100";
  const statusClass =
    statusStyles[task.status] ?? "bg-slate-100 text-slate-600";

  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No due date";

  return (
    <Link
      to={`/tasks/${task._id}`}
      className="group block rounded-xl border border-[var(--color-line)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
          {task.title}
        </h3>
        {task.priority && (
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${priorityClass}`}
          >
            {task.priority}
          </span>
        )}
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        {task.status && (
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusClass}`}
          >
            {task.status}
          </span>
        )}
        <span className="ml-auto text-xs text-[var(--color-muted)]">
          {dueLabel}
        </span>
      </div>
    </Link>
  );
}
