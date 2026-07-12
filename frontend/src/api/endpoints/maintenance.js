import axiosClient from "../axiosClient";

export const listMaintenanceLogs = () => axiosClient.get("/api/v1/maintenance/");

export const createMaintenanceLog = (payload) =>
  axiosClient.post("/api/v1/maintenance/", payload);

export const closeMaintenanceLog = (logId, payload) =>
  axiosClient.patch(`/api/v1/maintenance/${logId}/close`, payload);
