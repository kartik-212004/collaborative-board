"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface User {
  email: string;
  name: string;
  id: string;
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
  const router = useRouter();
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
      const userId = localStorage.getItem("userId");

      if (token && userEmail && userName && userId) {
        setAuthState({
          token,
          user: { email: userEmail, name: userName, id: userId },
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

  const login = useCallback((token: string, user: User) => {
    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userId", user.id);

      setAuthState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error saving auth to localStorage:", error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");

      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      router.push("/signin");
    } catch (error) {
      console.error("Error clearing auth from localStorage:", error);
    }
  }, [router]);

  return {
    ...authState,
    login,
    logout,
  };
}
