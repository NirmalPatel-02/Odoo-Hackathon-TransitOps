import axiosClient from "../axiosClient";

export const listVehicles = () => axiosClient.get("/api/v1/vehicles/");

export const createVehicle = (payload) =>
  axiosClient.post("/api/v1/vehicles/", payload);

export const updateVehicle = (vehicleId, payload) =>
  axiosClient.patch(`/api/v1/vehicles/${vehicleId}`, payload);
