
import { useState } from "react";
import { Link } from "react-router-dom";
import { generatePlan } from "../api/aiApi";
import PlanReview from "../components/PlanReview";

const fieldClass =
  "w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]";

export default function AIPlanner() {
  const [formData, setFormData] = useState({
    goal: "",
    duration: 30,
    hoursPerDay: 2,
    experienceLevel: "Beginner",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [approvalToken, setApprovalToken] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setApprovalToken(null);
    setGeneratedPlan(null);

    try {
      if (
        !Number.isInteger(formData.duration) ||
        formData.duration <= 0 ||
        formData.duration > 90
      ) {
        setError("Duration must be a whole number between 1 and 90 days");
        return;
      }
      if (formData.hoursPerDay < 1 || formData.hoursPerDay > 24) {
        setError("Hours per day must be between 1 and 24");
        return;
      }

      if (!formData.goal.trim()) {
        setError("Goal must not be empty");
        return;
      }
      setLoading(true);
      const response = await generatePlan(formData);
      setApprovalToken(response.approvalToken);
      setGeneratedPlan(response.plan);
      console.log(response.plan);
    } catch (err) {
      if (err.response) {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            AI Planner
          </h1>
          <p className="mt-2 text-muted">
            Set a goal and generate a plan you can review before adding
            tasks.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="planner-goal" className={labelClass}>
                Goal
              </label>
              <input
                id="planner-goal"
                type="text"
                placeholder="What do you want to accomplish?"
                value={formData.goal}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, goal: e.target.value }))
                }
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="planner-duration" className={labelClass}>
                  Duration (days)
                </label>
                <input
                  id="planner-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: Number(e.target.value),
                    }))
                  }
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="planner-hours" className={labelClass}>
                  Hours per day
                </label>
                <input
                  id="planner-hours"
                  type="number"
                  value={formData.hoursPerDay}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hoursPerDay: Number(e.target.value),
                    }))
                  }
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="planner-experience" className={labelClass}>
                Experience level
              </label>
              <select
                id="planner-experience"
                value={formData.experienceLevel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experienceLevel: e.target.value,
                  }))
                }
                className={fieldClass}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Generating…" : "Generate plan"}
            </button>
          </form>
        </div>

        {generatedPlan && (
          <div className="mt-8">
            <PlanReview plan={generatedPlan} approvalToken={approvalToken} />
          </div>
        )}
      </main>
    </div>
  );
}
