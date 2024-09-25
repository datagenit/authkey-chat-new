import { createContext, useEffect, useState } from "react";
import { getCookie } from "../utils/Utils";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const userCookie = getCookie('user');
    const userInfo = userCookie ? JSON.parse(userCookie) : null;
    setCurrentUser(userInfo?.data);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
