import { useContext,useState } from "react";

import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from '../api/axios.js'

export default function Login() {

const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setError("");
    try {
      
    const response = await api.post("/login", {
      email,password
    })
      
      const { user, token } = response.data;
      login(user, token);
      
      console.log(response.data);
      navigate("/dashboard");
      
    } catch (error) {
       if (error.response) {
         console.log(error.response.status);
        setError(error.response.data.message);
       } else {
         console.log(error.message);
       }
  }
    
    
    
  }


  return (
    <>
      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>
        <label>Email:</label>{" "}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>{" "}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </>
  );
}
