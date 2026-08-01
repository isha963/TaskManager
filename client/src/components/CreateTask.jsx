import { useState } from "react";
import { createTask } from "../api/taskApi";

const fieldClass =
  "w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]";

export default function CreateTask({ fetchTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const taskData = {
        title,
        description,
        dueDate,
        priority,
        status,
      };

      await createTask(taskData);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("");
      setStatus("");
      fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
        New task
      </h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Add something to your list.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="task-title" className={labelClass}>
            Title
          </label>
          <input
            id="task-title"
            placeholder="What needs doing?"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label htmlFor="task-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="task-description"
            placeholder="Optional details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${fieldClass} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="task-due" className={labelClass}>
            Due date
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="task-priority" className={labelClass}>
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={fieldClass}
            >
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="task-status" className={labelClass}>
              Status
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={fieldClass}
            >
              <option value="">Select</option>
              <option value="Todo">To do</option>
              <option value="In Progress">In progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create task"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
