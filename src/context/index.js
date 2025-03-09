import React, { createContext, useState, useContext } from "react";
import axios from "axios";

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (username, password) => {
    const response = await axios.post("http://localhost:8000/auth/login", {
      username,
      password
    });

    if (response.data.status === true) {
      localStorage.setItem("token", response.data.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.data.username))
      setUser(response.data.data.username)
      setIsAuthenticated(true)
    }

    return response
  }

  return (
    <AppContext.Provider value={{user, setUser, setIsAuthenticated, isAuthenticated, login}}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  return useContext(AppContext);
};