
import { useState } from "react";
import { approvePlan } from "../api/aiApi";

const priorityStyles = {
  High: "bg-rose-50 text-rose-700 ring-rose-100",
  Medium: "bg-amber-50 text-amber-800 ring-amber-100",
  Low: "bg-emerald-50 text-emerald-800 ring-emerald-100",
};

export default function PlanReview({ plan, approvalToken }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await approvePlan(plan.tasks, approvalToken);
      setSuccess(response.message);
      setIsApproved(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to approve your plan. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const taskCount = plan.tasks?.length ?? 0;

  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Review your AI plan
        </h2>
        <p className="mt-1 text-sm text-muted">
          {taskCount === 0
            ? "No tasks in this plan"
            : `${taskCount} task${taskCount === 1 ? "" : "s"} ready to approve`}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {success}
        </div>
      )}

      <ul className="grid gap-3">
        {plan.tasks.map((task, index) => {
          const priorityClass =
            priorityStyles[task.priority] ??
            "bg-slate-100 text-slate-600 ring-slate-100";
          const dueLabel = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "No due date";

          return (
            <li
              key={index}
              className="rounded-xl border border-line bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight text-ink">
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
                <p className="mt-2 text-sm text-muted">{task.description}</p>
              )}

              <p className="mt-3 text-xs text-muted">{dueLabel}</p>

              {task.subtasks?.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                  {task.subtasks.map((subtask, subIndex) => (
                    <li
                      key={subIndex}
                      className="text-sm text-ink before:mr-2 before:text-muted before:content-['•']"
                    >
                      {subtask.title}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={handleApprove}
        disabled={loading || isApproved}
        className="mt-5 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Saving…" : isApproved ? "Approved" : "Approve plan"}
      </button>
    </section>
  );
}
