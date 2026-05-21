import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/api/dashboardApi";

const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again!");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useDashboard;