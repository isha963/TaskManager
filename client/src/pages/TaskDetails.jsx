import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask, deleteTask } from "../api/taskApi";

const fieldClass =
  "w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]";

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

function toDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function TaskDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
  });
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      setError("");
      try {
        const response = await getTaskById(id);
        setTask(response.task);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTask();
  }, [id]);

  const handleEdit = () => {
    setError("");
    setFormData({
      title: task.title ?? "",
      description: task.description ?? "",
      dueDate: toDateInputValue(task.dueDate),
      priority: task.priority ?? "",
      status: task.status ?? "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setError("");
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await updateTask(id, formData);
      setTask(res.task);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );
    if (!confirmed) return;

    setError("");
    setDeleting(true);
    try {
      await deleteTask(id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (!task && !error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-sm text-muted">Loading task…</p>
      </div>
    );
  }

  if (!task && error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
        <Link
          to="/dashboard"
          className="mt-4 inline-block text-sm font-semibold text-accent hover:text-accent-hover"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No due date";

  const priorityClass =
    priorityStyles[task.priority] ?? "bg-slate-100 text-slate-600 ring-slate-100";
  const statusClass =
    statusStyles[task.status] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-muted transition hover:text-accent"
          >
            ← Dashboard
          </Link>
          
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          {isEditing ? (
            <>
              <h1 className="text-xl font-bold tracking-tight text-ink">
                Edit task
              </h1>
              <p className="mt-1 text-sm text-muted">
                Update the details below, then save.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="edit-title" className={labelClass}>
                    Title
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className={`${fieldClass} resize-y`}
                  />
                </div>

                <div>
                  <label htmlFor="edit-due" className={labelClass}>
                    Due date
                  </label>
                  <input
                    id="edit-due"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className={fieldClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="edit-priority" className={labelClass}>
                      Priority
                    </label>
                    <select
                      id="edit-priority"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className={fieldClass}
                    >
                      <option value="">Select</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-status" className={labelClass}>
                      Status
                    </label>
                    <select
                      id="edit-status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={fieldClass}
                    >
                      <option value="">Select</option>
                      <option value="Todo">To do</option>
                      <option value="In Progress">In progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    {task.title}
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Due {dueLabel}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.priority && (
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityClass}`}
                    >
                      {task.priority}
                    </span>
                  )}
                  {task.status && (
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-medium ${statusClass}`}
                    >
                      {task.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-line pt-6">
                <p className={labelClass}>Description</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {task.description?.trim()
                    ? task.description
                    : "No description provided."}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
