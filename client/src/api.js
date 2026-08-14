const API = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("token");
}

export async function api(path, options = {}) {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = {
    ...(options.headers || {}),
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API}${path}`;
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("API is not available yet");
  }
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}
