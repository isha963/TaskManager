import TaskCard from "./TaskCard";

export default function TaskList({ tasks }) {
  if (!tasks) {
    return (
      <div className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-8 text-center">
        <p className="text-sm text-[var(--color-muted)]">Loading tasks…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
            Your tasks
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {tasks.length === 0
              ? "Nothing here yet"
              : `${tasks.length} task${tasks.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white/60 px-6 py-12 text-center">
          <p className="text-sm font-medium text-[var(--color-ink)]">
            No tasks yet
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Use the form to create your first one.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-1 xl:grid-cols-2">
          {tasks.map((task) => (
            <li key={task._id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
