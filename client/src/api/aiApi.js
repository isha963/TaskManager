import api from "./axios";

export const generatePlan = async (input) => {
  const response = await api.post("/ai/generate-plan", input);

  return response.data;
};

export const approvePlan = async (tasks, approvalToken) => {
  const response = await api.post("/ai/approve-plan", { tasks, approvalToken });

  return response.data;
};