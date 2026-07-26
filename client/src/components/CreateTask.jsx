import { useState } from "react";

import { createTask } from "../api/taskApi";

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      
      const taskData = {
        title,
        description,
        dueDate,
        priority,
        status,
      }

      const response = await createTask(taskData);
      console.log(response);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("");
      setStatus("");
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  }

    return (
      <>
        <h1>Create a new task</h1>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>{" "}
          <input
            placeholder="enter title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <label>Description:</label>{" "}
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <label>Duedate:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
            }}
          />
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
            }}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            <option value="">Select Status</option>
            <option value="Todo">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button type="submit">Create</button>
        </form>
        {error && <p>{error}</p>}
      </>
    );
  }
