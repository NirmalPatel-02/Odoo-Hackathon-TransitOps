import axiosClient from "../axiosClient";

export const getFleetSummary = () =>
  axiosClient.get("/api/v1/reports/summary");

export const exportFleetReportCsv = () =>
  axiosClient.get("/api/v1/reports/export/csv", {
    responseType: "blob",
  });
