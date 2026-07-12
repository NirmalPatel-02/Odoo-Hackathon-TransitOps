import axiosClient from "../axiosClient";

// FastAPI's auth endpoint expects form-encoded credentials for OAuth2 login.
export const loginRequest = (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  return axiosClient.post("/api/v1/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const registerRequest = ({ name, email, password, role_name }) =>
  axiosClient.post("/api/v1/auth/register", {
    name,
    email,
    password,
    role_name,
  });