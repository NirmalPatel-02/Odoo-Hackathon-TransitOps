import axiosClient from "../axiosClient";

export const listExpenses = () => axiosClient.get("/api/v1/expenses/expense");

export const createFuelLog = (payload) =>
  axiosClient.post("/api/v1/expenses/fuel", payload);

export const createExpense = (payload) =>
  axiosClient.post("/api/v1/expenses/expense", payload);
