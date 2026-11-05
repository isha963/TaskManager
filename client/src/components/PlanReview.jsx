
import { useState } from "react";
import { approvePlan } from "../api/aiApi";

export default function PlanReview({ plan , approvalToken}) {
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
  return (
    <>
      <h1>Review Your AI Plan</h1>
      <div>
        <ul>
          {plan.tasks.map((task, index) => (
            <li key={index}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Due Date: {task.dueDate}</p>
              <ul>
                {task.subtasks.map((subtask, subIndex) => (
                  <li key={subIndex}>{subtask.title}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleApprove} disabled={loading || isApproved}>
        {loading ? "Saving..." : isApproved ? "Approved" : "Approve Plan"}
      </button>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </>
  );
}