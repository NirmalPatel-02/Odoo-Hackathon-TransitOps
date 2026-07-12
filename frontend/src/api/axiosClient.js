import axios from "axios";

// Assumption: FastAPI is served at this base URL in dev (matches the
// localhost:8000 swagger docs link you shared). Override with a .env
// value (VITE_API_BASE_URL) for staging/prod builds.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const AUTH_STORAGE_KEY = "transitops_auth";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every request, read straight from sessionStorage so
// this file has no dependency on AuthContext (avoids circular imports).
axiosClient.interceptors.request.use((config) => {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (raw) {
    const { token } = JSON.parse(raw);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401 (expired/invalid token), clear the session and bounce to login.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { AUTH_STORAGE_KEY };
export default axiosClient;