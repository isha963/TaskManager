import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";



export default function PublicRoute({ children }) {

  const { token , authLoading} = useContext(AuthContext);

  if ((authLoading)) {
    return <p>Checking authentication...</p>;
  }
  if (token) {
    return <Navigate to={"/dashboard"} replace/>
  }
   
  return children;
 }