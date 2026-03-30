import { createContext, useState, useContext } from "react";
import {
  ADMIN_LOGIN_EMAIL,
  ADMIN_LOGIN_PASSWORD,
} from "../config/adminCredentials";

const ADMIN_SESSION_KEY = "dawa_admin_session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [city, setCity] = useState(null);
  const [address, setAddress] = useState(null);
  const [adminSession, setAdminSession] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  const loginAdmin = (email, password) => {
    if (
      email === ADMIN_LOGIN_EMAIL &&
      password === ADMIN_LOGIN_PASSWORD
    ) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setAdminSession(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      /* ignore */
    }
    setAdminSession(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        city,
        setCity,
        address,
        setAddress,
        adminSession,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
