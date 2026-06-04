import apiClient from "./apiClient";

export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return response.data;
};

export const markNotificationRead = async (notifId) => {
  const response = await apiClient.put(`/notifications/${notifId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await apiClient.put("/notifications/read-all");
  return response.data;
};