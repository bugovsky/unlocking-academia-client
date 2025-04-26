import { isProduction } from "./utils";

const API_BASE_URL = isProduction
  ? "http://your-production-url/api/v1"
  : "http://localhost:8000";

interface ApiError extends Error {
  status: number;
  message: string;
  details?: string;
}

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem("jwt_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error: ApiError = new Error(`HTTP error! status: ${response.status}`) as ApiError;
      error.status = response.status;
      error.message = errorText || response.statusText;
      error.details = JSON.stringify({
        endpoint: `${API_BASE_URL}${endpoint}`,
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw error;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Не удалось выполнить запрос:", error);
    throw error;
  }
};

export const apiFetchPublic = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error: ApiError = new Error(`HTTP error! status: ${response.status}`) as ApiError;
      error.status = response.status;
      error.message = errorText || response.statusText;
      error.details = JSON.stringify({
        endpoint: `${API_BASE_URL}${endpoint}`,
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw error;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Не удалось выполнить запрос:", error);
    throw error;
  }
};