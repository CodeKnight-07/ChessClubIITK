import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for the JWT token on page load
    const storedToken = localStorage.getItem('chess-club-jwt');
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  // Update login to accept the token from your Flask backend
  const login = (jwtToken) => {
    setIsLoggedIn(true);
    setToken(jwtToken);
    localStorage.setItem('chess-club-jwt', jwtToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('chess-club-jwt');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};