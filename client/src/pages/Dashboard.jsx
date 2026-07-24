import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const { user,logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    
    logout();

    return navigate("/login") ;
    

  }

  return (
    <>
      <h1>Dashboard</h1>
      <h3> Welcome {user?.name}!</h3>
      <button onClick={handleLogout}>logout</button>
    </>
  );
}