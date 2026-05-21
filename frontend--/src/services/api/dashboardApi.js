import apiClient from "./apiClient";

export const getDashboardStats = async () => {
  const response = await apiClient.get("/supplier/dashboard/stats");
  return response.data;
};