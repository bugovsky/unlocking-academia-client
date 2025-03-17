import { useState, useEffect } from "react";
import { getCurrentUser, isAuthenticated as checkAuth, logout as removeToken } from "../common/auth";

export const useAuth = () => {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getCurrentUser>>>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(checkAuth());
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isLoading, isAuthenticated, logout };
};