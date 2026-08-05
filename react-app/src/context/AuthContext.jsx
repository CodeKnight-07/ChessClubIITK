import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // --- REWRITTEN: Completely bulletproof decoder that NEVER crashes caller functions ---
  const decodeTokenPayload = (jwtToken) => {
    // 1. Guard against null, undefined, or malformed strings early
    if (!jwtToken || typeof jwtToken !== 'string' || jwtToken.split('.').length < 2) {
      console.warn("Invalid token shape received for decoding.");
      return null;
    }

    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // 2. Safe base64 decoding string conversion
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (e) {
      // 3. CATCH EXCEPTION HERE: Logs the warning safely without blowing up the login loop!
      console.error("Internal JWT string decode failure handled gracefully:", e);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('chess-club-jwt');
    const storedEmail = localStorage.getItem('logged_in_user_email');

    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
      
      const decoded = decodeTokenPayload(storedToken);
      if (decoded) {
        const tokenSaysAdmin = decoded.is_admin === 1 || decoded.is_admin === true || decoded.isAdmin === true || decoded.admin === true || decoded.role === 'admin' || decoded.role === 'secretary';
        setUser({
          email: decoded.email || storedEmail,
          is_admin: tokenSaysAdmin 
        });
      } else {
        setUser(null);
      }
    }
  }, []);

  // Safe login execution block
  const login = (jwtToken) => {
    setIsLoggedIn(true);
    setToken(jwtToken);
    localStorage.setItem('chess-club-jwt', jwtToken);

    const decoded = decodeTokenPayload(jwtToken);
    const storedEmail = localStorage.getItem('logged_in_user_email');
    
    if (decoded) {
      const tokenSaysAdmin = decoded.is_admin === 1 || decoded.is_admin === true || decoded.isAdmin === true || decoded.admin === true || decoded.role === 'admin' || decoded.role === 'secretary';
      setUser({
        email: decoded.email || storedEmail,
        is_admin: tokenSaysAdmin
      });
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem('chess-club-jwt');
    localStorage.removeItem('logged_in_user_email');
    localStorage.removeItem('chess-club-role');
    
    // Clear all client-side cached database properties on logout
    localStorage.removeItem('chess_club_cache_profile');
    localStorage.removeItem('chess_club_cache_blogs');
    localStorage.removeItem('chess_club_cache_events');
    localStorage.removeItem('chess_club_cache_gallery');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};