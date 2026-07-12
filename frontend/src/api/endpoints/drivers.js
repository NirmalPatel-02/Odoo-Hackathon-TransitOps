import axiosClient from "../axiosClient";

export const listDrivers = () => axiosClient.get("/api/v1/drivers/");

export const createDriver = (payload) =>
  axiosClient.post("/api/v1/drivers/", payload);

export const updateDriver = (driverId, payload) =>
  axiosClient.patch(`/api/v1/drivers/${driverId}`, payload);
