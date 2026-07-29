import { useContext, useState,useEffect } from "react";
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
      console.log(response);
      // assume response.tasks or response itself is an array
      setTasks(response.tasks ?? response ?? []);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };
  useEffect(() => {
      fetchTasks();
    }, []);
  

  

  const handleLogout = () => {
    logout();

    return navigate("/login");
  };

  return (
    <>
      <h1>Dashboard</h1>
      <h3> Welcome {user?.name}!</h3>
      <CreateTask fetchTasks={fetchTasks}  />
      <TaskList tasks={tasks} />
      <button onClick={handleLogout}>logout</button>
      {error && { error }}
    </>
  );
}
