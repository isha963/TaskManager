import { useContext } from "react";
import AuthContext from "../context/AuthContext";


export default function Dashboard() {
  const { user } = useContext(AuthContext);


  return (
    <>
      <h1>Dashboard</h1>
      <h3> Welcome {user?.name}!</h3>
    </>
  );
}