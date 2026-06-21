import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { getOrders, deleteOrder } from "../services/orderService";
import OrderForm from "../components/OrderForm";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(false);

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ================= FETCH =================
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [orderRes, customerRes] = await Promise.all([
        getOrders(),
        api.get("/customers"),
      ]);

      // Orders
      if (orderRes?.status) {
        setOrders(orderRes.data || []);
      } else {
        toast.error(orderRes?.message || "Failed to fetch orders");
      }

      // Customers (safer handling)
      const customerData = customerRes?.data?.data || customerRes?.data || [];

      setCustomers(Array.isArray(customerData) ? customerData : []);
    } catch (err) {
      toast.error("Something went wrong while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await deleteOrder(id);

      if (res?.status) {
        toast.success(res.message || "Order deleted");
        fetchOrders();
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= HELPERS =================
  const getCustomerName = (id) => {
    return customers.find((c) => c.id === id)?.full_name || "Unknown";
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);

    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}-${d.getFullYear()} ${String(d.getHours()).padStart(
      2,
      "0",
    )}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  // ================= PAGINATION =================
  const totalPages = useMemo(
    () => Math.ceil(orders.length / pageSize),
    [orders.length],
  );

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, currentPage]);

  const goToPage = (page) => setCurrentPage(page);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // ================= MODALS =================
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openView = (order) => setSelectedOrder(order);
  const closeView = () => setSelectedOrder(null);

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Orders</h2>

        <button style={styles.addBtn} onClick={openModal}>
          + Place Order
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.tableBox}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Total Amount</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((o, index) => (
                  <tr key={o.id}>
                    <td style={styles.td}>
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>

                    <td style={styles.td}>{getCustomerName(o.customer_id)}</td>

                    <td style={styles.td}>₹{o.total_amount}</td>

                    <td style={styles.td}>{formatDate(o.created_at)}</td>

                    <td style={styles.td}>
                      <button
                        style={styles.viewBtn}
                        onClick={() => openView(o)}
                      >
                        View
                      </button>

                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(o.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      ...styles.td,
                      textAlign: "center",
                      fontWeight: "600",
                      padding: "20px",
                    }}
                  >
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        <div style={styles.pagination}>
          <button onClick={prevPage} style={styles.pageBtn}>
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              style={{
                ...styles.pageBtn,
                background: currentPage === i + 1 ? "#2563eb" : "#f3f4f6",
                color: currentPage === i + 1 ? "white" : "black",
              }}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={nextPage} style={styles.pageBtn}>
            Next
          </button>
        </div>
      </div>

      {/* CREATE ORDER MODAL */}
      {showModal && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Place Order</h3>
              <button style={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>

            <OrderForm
              onSuccess={() => {
                toast.success("Order placed successfully");
                fetchOrders();
                closeModal();
              }}
            />
          </div>
        </div>
      )}

      {/* VIEW ORDER MODAL */}
      {selectedOrder && (
        <div style={styles.overlay} onClick={closeView}>
          <div style={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Order Invoice</h3>
              <button style={styles.closeBtn} onClick={closeView}>
                ✕
              </button>
            </div>

            <div style={{ fontSize: "14px", marginBottom: "10px" }}>
              <p>
                <b>Customer:</b> {getCustomerName(selectedOrder.customer_id)}
              </p>
              <p>
                <b>Order ID:</b> {selectedOrder.id}
              </p>
              <p>
                <b>Date:</b> {formatDate(selectedOrder.created_at)}
              </p>
              <p>
                <b>Total:</b> ₹{selectedOrder.total_amount}
              </p>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {selectedOrder.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>
                      {item.product?.name || item.product_id}
                    </td>
                    <td style={styles.td}>{item.quantity}</td>
                    <td style={styles.td}>₹{item.price_at_purchase}</td>
                    <td style={styles.td}>
                      ₹{item.quantity * item.price_at_purchase}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  addBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  tableBox: {
    background: "white",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    border: "1px solid #e5e7eb",
    padding: "10px",
    background: "#f9fafb",
    textAlign: "left",
    fontWeight: "600",
  },
  td: {
    border: "1px solid #e5e7eb",
    padding: "10px",
  },
  viewBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "8px",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    marginTop: "15px",
  },
  pageBtn: {
    padding: "6px 10px",
    border: "1px solid #2a518b",
    background: "#010918",
    cursor: "pointer",
    borderRadius: "5px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "500px",
  },
  modalLarge: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "700px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eee",
    marginBottom: "10px",
    paddingBottom: "8px",
  },
  closeBtn: {
    border: "none",
    background: "#f3f4f6",
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
