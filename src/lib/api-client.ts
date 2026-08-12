const API_BASE_URL = typeof window !== "undefined" && window.location.origin.includes("localhost")
  ? "http://localhost:4000/api"
  : "/api";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ssg_auth_token");
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("ssg_auth_token", token);
  } else {
    localStorage.removeItem("ssg_auth_token");
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data as T;
  } catch (error: any) {
    console.warn(`API fetch error on ${endpoint}:`, error.message);
    throw error;
  }
}
