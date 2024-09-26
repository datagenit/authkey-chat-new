import { createContext, useEffect, useState } from "react";
import { getCookie ,setCookie } from "../utils/Utils";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const userCookie = getCookie("user");
    const userInfo = userCookie ? JSON.parse(userCookie) : null;
    setCurrentUser(userInfo?.data);
  }, []);
  const updateUser = (data) => {
    setCurrentUser(data);
    setCookie("user", JSON.stringify(data), 7);
  };
  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
