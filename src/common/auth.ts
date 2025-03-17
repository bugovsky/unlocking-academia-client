import { apiFetch } from "./api";
import { User } from "./types";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
}

interface UserCreate {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: string;
}

export const register = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  role?: string
): Promise<User> => {
  await apiFetch<User>("/user", {
    method: "POST",
    body: JSON.stringify({ email, password, firstname, lastname, role }),
  });
  return await login(email, password);
};

export const login = async (email: string, password: string): Promise<User> => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const data = await apiFetch<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  localStorage.setItem("jwt_token", data.access_token);

  const decoded = jwtDecode<JwtPayload>(data.access_token);
  const userId = decoded.sub;
  const user = await apiFetch<User>(`/user/${userId}`);
  return user;
};

export const logout = () => {
  localStorage.removeItem("jwt_token");
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const userId = decoded.sub;
    return await apiFetch<User>(`/user/${userId}`);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!localStorage.getItem("jwt_token");

export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub;
  } catch {
    return null;
  }
};