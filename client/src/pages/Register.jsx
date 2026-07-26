import {useContext, useState} from 'react'


import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { registerUser } from '../api/authApi.js';


export default function Register() {
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);


  const handleSubmit= async(e)=> {
    e.preventDefault();
    setError("");
    try {
      const userData = {
        name,
        email,
        password,
      };
      const response = await registerUser(userData);
    
      const { user, token } = response;
      login(user, token);
    
      console.log(response);
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
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>{" "}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Name:</label>{" "}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Password:</label>{" "}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Register</button>
      </form>
      {error && <p>{error}</p>}
    </>
  );
}
