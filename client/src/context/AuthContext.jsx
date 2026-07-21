import { createContext, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userdata, jwtToken) => {
    setUser(userdata);
    setToken(jwtToken);
  }

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          login,
          token,
          logout
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  )
}
