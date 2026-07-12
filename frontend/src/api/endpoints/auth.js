import axiosClient from "../axiosClient";

// Matches the schema you shared:
// POST /api/v1/auth/login -> { access_token, token_type, user: { id, name, email, role_name } }
export const loginRequest = (email, password) =>
  axiosClient.post("/api/v1/auth/login", { email, password });

// ASSUMPTION: no register endpoint schema was shared, so this follows the
// same /api/v1/auth/* convention as login. Confirm the path and payload
// shape against your FastAPI router (likely api/v1/routers/auth.py) and
// adjust if it differs.
export const registerRequest = ({ name, email, password, roleName }) =>
  axiosClient.post("/api/v1/auth/register", {
    name,
    email,
    password,
    role_name: roleName,
  });