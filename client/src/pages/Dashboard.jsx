import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CreateTask from "../components/CreateTask";

import TaskList from "../components/TaskList";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    return navigate("/login");
  };

  return (
    <>
      <h1>Dashboard</h1>
      <h3> Welcome {user?.name}!</h3>
      <CreateTask />
      <TaskList />
      <button onClick={handleLogout}>logout</button>
    </>
  );
}
