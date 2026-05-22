import apiClient from "./apiClient";

export const getProducts = async () => {
  const response = await apiClient.get("/supplier/products");
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await apiClient.post("/supplier/products", productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await apiClient.put(`/supplier/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await apiClient.delete(`/supplier/products/${productId}`);
  return response.data;
};