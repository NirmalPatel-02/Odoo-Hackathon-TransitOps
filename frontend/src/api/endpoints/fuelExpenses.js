import axiosClient from "../axiosClient";


export const createFuelLog = (payload) =>
  axiosClient.post("/api/v1/expenses/fuel", payload);

export const createExpense = (payload) =>
  axiosClient.post("/api/v1/expenses/expense", payload);
