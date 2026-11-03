import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token,authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
}
