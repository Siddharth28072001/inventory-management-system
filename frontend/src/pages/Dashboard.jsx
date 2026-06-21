import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await api.get("/inventory/dashboard");

      const data = res?.data?.data || {
        products: 0,
        customers: 0,
        orders: 0,
        low_stock: 0,
      };

      setStats({
        products: data.products ?? 0,
        customers: data.customers ?? 0,
        orders: data.orders ?? 0,
        lowStock: data.low_stock ?? 0,
      });

    } catch (err) {
      console.error("Dashboard fetch error:", err);

      setStats({
        products: 0,
        customers: 0,
        orders: 0,
        lowStock: 0,
      });

    } finally {
      setLoading(false);
    }
  };

  // Loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Products</h3>
          <p>{stats.products}</p>
        </div>

        <div style={styles.card}>
          <h3>Customers</h3>
          <p>{stats.customers}</p>
        </div>

        <div style={styles.card}>
          <h3>Orders</h3>
          <p>{stats.orders}</p>
        </div>

        <div style={styles.card}>
          <h3>Low Stock</h3>
          <p>{stats.lowStock}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};