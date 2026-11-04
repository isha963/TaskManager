
import { useState } from "react";
import { generatePlan } from "../api/aiApi";
import PlanReview from "../components/PlanReview"

export default function AIPlanner() {
  const [formData, setFormData] = useState({
    goal: "",
    duration: 30,
    hoursPerDay: 2,
    experienceLevel: "Beginner",
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    setError("");
    setLoading(true);
    setGeneratedPlan(null);
    try {
      if ( !Number.isInteger(formData.duration)||formData.duration<=0|| formData.duration >90) {
        setError("Duration must be a whole number between 1 and 90 days");
        return;
      }
      if (
        
        formData.hoursPerDay < 1 ||
        formData.hoursPerDay > 24
      ) {
        setError("Hours per day must be a whole number between 1 and 24 hours");
        return;
      }

      if (formData.goal ==="" || formData.goal.trim() ==="") {
        setError("Goal must not be empty");
        return;
      }
      const response = await generatePlan(formData);
      setGeneratedPlan(response.plan);
      console.log(generatedPlan);
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
  }
    return (
      <>
        <h1>AI PLanner</h1>

        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          <label>
            Goal:
            <input
              type="text"
              value={formData.goal}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, goal: e.target.value }))
              }
            />
          </label>
          <label>
            Duaration:
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  duration: Number(e.target.value),
                }))
              }
            />
          </label>
          <label>
            Hours per day:
            <input
              type="number"
              value={formData.hoursPerDay}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hoursPerDay: Number(e.target.value),
                }))
              }
            />
          </label>

          <label>
            {" "}
            Experience level:
            <select
              value={formData.experienceLevel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  experienceLevel: e.target.value,
                }))
              }
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "generating..." : "Generate Plan"}
          </button>
        </form>

        {generatedPlan && <PlanReview plan={generatedPlan} />}
      </>
    );
  }
