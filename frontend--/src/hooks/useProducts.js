import { useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../../backend/services/api/productApi";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data.products);
    } catch (err) {
      setError("Failed to load products. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      await fetchProducts();
      return { success: true };
    } catch (err) {
      return { success: false, message: "Failed to add product!" };
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      await updateProduct(productId, productData);
      await fetchProducts();
      return { success: true };
    } catch (err) {
      return { success: false, message: "Failed to update product!" };
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      await fetchProducts();
      return { success: true };
    } catch (err) {
      return { success: false, message: "Failed to delete product!" };
    }
  };

  return {
    products,
    loading,
    error,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
};

export default useProducts;