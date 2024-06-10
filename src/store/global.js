// GlobalStateProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";

const GlobalStateContext = createContext();

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const GlobalStateProvider = ({ children }) => {
  const [userType, setUserType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");

      const getUserProfile = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${apiUrl}/api/users/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserType(data.user.role);
            setIsLoading(false);
            setIsLoggedIn(true);
            setToken(storedToken);
          } else {
            localStorage.removeItem("token");
            setIsLoading(false);
            setIsLoggedIn(false);
          }
        } catch (error) {
          localStorage.removeItem("token");
          setIsLoading(false);
          setIsLoggedIn(false);
        }
      };
      if (storedToken) getUserProfile();
      else {
        setIsLoading(false);
        setIsLoggedIn(false);
      }
    }
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{ userType, setUserType, isLoggedIn, setIsLoggedIn, isLoading, setIsLoading, token, setToken }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
