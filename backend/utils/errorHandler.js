// src/utils/errorHandler.js

export const getErrorMessage = (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 400) return "Bad request. Please check your input!";
    if (status === 401) return "Unauthorized. Please login again!";
    if (status === 403) return "Access denied. You don't have permission!";
    if (status === 404) return "Data not found!";
    if (status === 500) return "Server error. Please try again later!";
    return "Something went wrong. Please try again!";
  }
  if (error.request) {
    return "Network error. Please check if backend is running!";
  }
  return "Something went wrong. Please try again!";
};