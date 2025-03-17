import { isProduction } from "./utils";

const API_BASE_URL = isProduction
  ? "http://your-production-url/api/v1"
  : "http://localhost:8000";

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
      console.error(
        `Ошибка запроса: ${response.status} ${response.statusText}`,
        {
          endpoint: `${API_BASE_URL}${endpoint}`,
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        }
      );
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
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
      console.error(
        `Ошибка запроса: ${response.status} ${response.statusText}`,
        {
          endpoint: `${API_BASE_URL}${endpoint}`,
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        }
      );
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Не удалось выполнить запрос:", error);
    throw error;
  }
};