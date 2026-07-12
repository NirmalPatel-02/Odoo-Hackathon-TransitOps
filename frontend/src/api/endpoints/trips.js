import axiosClient from "../axiosClient";

export const listTrips = () => axiosClient.get("/api/v1/trips/");

export const createTrip = (payload) =>
  axiosClient.post("/api/v1/trips/", payload);

export const updateTripStatus = (tripId, status) =>
  axiosClient.patch(`/api/v1/trips/${tripId}/status`, { status });
