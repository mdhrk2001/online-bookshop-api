import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getToken = () => {
    const storedToken = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    const expiry = localStorage.getItem('tokenExpiry') || sessionStorage.getItem('tokenExpiry');

    if (storedToken && expiry) {
      const now = new Date();
      if (now.getTime() > parseInt(expiry)) {
        // Token expired
        localStorage.removeItem('userToken');
        localStorage.removeItem('tokenExpiry');
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('tokenExpiry');
        return null;
      }
      return storedToken;
    }
    return null;
  };

  const [userToken, setUserToken] = useState(getToken());

  useEffect(() => {
    setUserToken(getToken());
  }, []);

  const login = (token, remember = false) => {
    setUserToken(token);

    const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // 7 days in ms

    if (remember) {
      localStorage.setItem('userToken', token);
      localStorage.setItem('tokenExpiry', expiryTime);
    } else {
      sessionStorage.setItem('userToken', token);
      sessionStorage.setItem('tokenExpiry', expiryTime);
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('tokenExpiry');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('tokenExpiry');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};