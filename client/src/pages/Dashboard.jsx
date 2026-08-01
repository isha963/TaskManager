import { useContext, useState, useEffect, useMemo } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CreateTask from "../components/CreateTask";
import TaskList from "../components/TaskList";
import { getAllTasks } from "../api/taskApi";

export default function Dashboard() {
  const [tasks, setTasks] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    setError("");
    try {
      const response = await getAllTasks();
      setTasks(response.tasks ?? response ?? []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = useMemo(() => {
    const list = tasks ?? [];
    return {
      total: list.length,
      todo: list.filter((t) => t.status === "Todo").length,
      inProgress: list.filter((t) => t.status === "In Progress").length,
      done: list.filter((t) => t.status === "Done").length,
    };
  }, [tasks]);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-line)] bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-bold text-white">
              TM
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-[var(--color-ink)]">
                TaskManager
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                Stay on top of your work
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-[var(--color-ink)]">
                {user?.name}
              </p>
              <p className="text-xs text-[var(--color-muted)]">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-[var(--color-line)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Good to see you, {firstName}
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Create tasks, track progress, and clear your list.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: stats.total },
            { label: "To do", value: stats.todo },
            { label: "In progress", value: stats.inProgress },
            { label: "Done", value: stats.done },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--color-line)] bg-white/80 px-4 py-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-ink)]">
                {tasks === null ? "—" : stat.value}
              </p>
            </div>
          ))}
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
          <aside>
            <CreateTask fetchTasks={fetchTasks} />
          </aside>
          <section>
            <TaskList tasks={tasks} />
          </section>
        </div>
      </main>
    </div>
  );
}
