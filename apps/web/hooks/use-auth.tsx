"use client";

import { useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
  id?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthState & {
  login: (token: string, user: User) => void;
  logout: () => void;
} {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");

      if (token && userEmail && userName) {
        setAuthState({
          token,
          user: { email: userEmail, name: userName },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error reading auth from localStorage:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  const login = (token: string, user: User) => {
    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);
      console.log(user.name);

      setAuthState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error saving auth to localStorage:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");

      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error clearing auth from localStorage:", error);
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
}
