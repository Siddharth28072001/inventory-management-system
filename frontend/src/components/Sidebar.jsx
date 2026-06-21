import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={{ color: "white" }}> Inventory & Order Management System
</h2>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/dashboard">Dashboard</Link>
        <Link style={styles.link} to="/products">Products</Link>
        <Link style={styles.link} to="/customers">Customers</Link>
        <Link style={styles.link} to="/orders">Orders</Link>
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#111827",
    padding: "20px",
    position: "fixed",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "6px",
    background: "#1f2937",
  },
};