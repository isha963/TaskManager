import request from "supertest";
import "dotenv/config";
import { jest, describe, test, expect, beforeEach } from "@jest/globals";

import jwt from "jsonwebtoken";

// Ensure a JWT secret is available for testing
process.env.JWT_SECRET ||= "test-secret";

// Create mock functions
const mockFindById = jest.fn();
const mockGenerateWithGemini = jest.fn();

// Mock the User model
jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    findById: mockFindById,
  },
}));

// Mock the Gemini service
jest.unstable_mockModule("../services/geminiService.js", () => ({
  generateWithGemini: mockGenerateWithGemini,
}));

// Import app only after registering mocks
const { default: app } = await import("../app.js");

describe("AI Planner API", () => {
  beforeEach(() => {
    mockFindById.mockReset();
    mockGenerateWithGemini.mockReset();
  });

  test("should return 401 when token is missing", async () => {
    const response = await request(app).post("/api/ai/generate-plan");

    expect(response.statusCode).toBe(401);
  });

  test("should return 401 when token is invalid", async () => {
    const response = await request(app)
      .post("/api/ai/generate-plan")
      .set("Authorization", "Bearer invalid-token");

    expect(response.statusCode).toBe(401);
  });

  test("should return 400 when required fields are missing", async () => {
    const fakeUser = {
      _id: "123456789012345678901234",
    };

    mockFindById.mockResolvedValue(fakeUser);

    const token = jwt.sign({ userId: fakeUser._id }, process.env.JWT_SECRET);

    const response = await request(app)
      .post("/api/ai/generate-plan")
      .set("Authorization", `Bearer ${token}`)
      .send({
        goal: "Prepare for a Node.js interview",
      });

    expect(response.statusCode).toBe(400);
    expect(mockGenerateWithGemini).not.toHaveBeenCalled();
  });

  test("should generate a plan for an authenticated user", async () => {
    const fakeUser = {
      _id: "123456789012345678901234",
    };

    mockFindById.mockResolvedValue(fakeUser);

    mockGenerateWithGemini.mockResolvedValue(
      "Day 1: Learn Node.js fundamentals",
    );

    const token = jwt.sign({ userId: fakeUser._id }, process.env.JWT_SECRET);

    const response = await request(app)
      .post("/api/ai/generate-plan")
      .set("Authorization", `Bearer ${token}`)
      .send({
        goal: "Prepare for a Node.js interview",
        duration: 7,
        hoursPerDay: 2,
        experienceLevel: "Intermediate",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.plan).toBe("Day 1: Learn Node.js fundamentals");

    expect(mockFindById).toHaveBeenCalledWith(fakeUser._id);
    expect(mockGenerateWithGemini).toHaveBeenCalledTimes(1);
  });

  test("should return 500 when Gemini API fails", async () => {
    const fakeUser = {
      _id: "123456789012345678901234",
    };

    mockFindById.mockResolvedValue(fakeUser);

    mockGenerateWithGemini.mockRejectedValue(
      new Error("Gemini service unavailable"),
    );

    const token = jwt.sign({ userId: fakeUser._id }, process.env.JWT_SECRET);

    const response = await request(app)
      .post("/api/ai/generate-plan")
      .set("Authorization", `Bearer ${token}`)
      .send({
        goal: "Prepare for a Node.js interview",
        duration: 7,
        hoursPerDay: 2,
        experienceLevel: "Intermediate",
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Gemini service unavailable");

    expect(mockGenerateWithGemini).toHaveBeenCalledTimes(1);
  });
test("should return 401 when authenticated user does not exist", async () => {
  mockFindById.mockResolvedValue(null);

  const token = jwt.sign(
    { userId: "123456789012345678901234" },
    process.env.JWT_SECRET,
  );

  const response = await request(app)
    .post("/api/ai/generate-plan")
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(401);
  expect(mockGenerateWithGemini).not.toHaveBeenCalled();
});
  
  
});