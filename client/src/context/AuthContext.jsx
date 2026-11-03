import { createContext, useEffect,useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setAuthLoading(false);
  }, []);

  const login = (userdata, jwtToken) => {
    setUser(userdata);
    setToken(jwtToken);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userdata));
  }

  const logout = () => {
    setUser(null);
    setToken(null);
     localStorage.removeItem("token");
     localStorage.removeItem("user");
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          login,
          token,
          logout,
          authLoading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
export default AuthContext;