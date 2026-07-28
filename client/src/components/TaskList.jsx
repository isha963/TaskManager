import { useEffect, useState } from "react";
import TaskCard from "./TaskCard"
import {  getAllTasks } from "../api/taskApi";

export default function TaskList() {
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      setError("");
      try {
        const response = await getAllTasks();
        console.log(response);
        // assume response.tasks or response itself is an array
        setTasks(response.tasks ?? response ?? []);
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      }
    };
    fetchTasks();
  }, []);

  return (
    <>
      <h1>Your tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
          tasks.map(task => (
            <TaskCard
        key={task._id}
        task={task}
    />
        ))
      )}
      {error && <p>{error}</p>}
    </>
  );
}