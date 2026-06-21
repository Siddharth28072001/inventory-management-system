import { useEffect, useState } from "react";
import { getCustomers, deleteCustomer } from "../services/customerService";
import CustomerForm from "../components/CustomerForm";
import { toast } from "react-toastify";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  // ================= PAGINATION STATE =================
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ================= FETCH =================
  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();

      if (res.status) {
        setCustomers(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      const res = await deleteCustomer(id);

      if (res.status) {
        toast.success(res.message);
        fetchCustomers();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ================= MODAL =================
  const openAddModal = () => {
    setEditCustomer(null);
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setEditCustomer(customer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCustomer(null);
  };

  // ================= PAGINATION LOGIC =================
  const totalPages = Math.ceil(customers.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedCustomers = customers.slice(
    startIndex,
    startIndex + pageSize
  );

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Customers</h2>

        <button style={styles.addBtn} onClick={openAddModal}>
          + Add Customer
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.tableBox}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCustomers.map((c, index) => (
              <tr key={c.id} style={styles.tr}>
                <td style={styles.td}>{startIndex + index + 1}</td>

                <td style={styles.td}>{c.full_name}</td>
                <td style={styles.td}>{c.email}</td>
                <td style={styles.td}>{c.phone_number}</td>

                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() => openEditModal(c)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
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
                background:
                  currentPage === i + 1 ? "#2563eb" : "#f3f4f6",
                color:
                  currentPage === i + 1 ? "white" : "black",
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

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>
                {editCustomer ? "Edit Customer" : "Add Customer"}
              </h3>

              <button style={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>

            <CustomerForm
              editCustomer={editCustomer}
              onSuccess={(res) => {
                if (res.status) {
                  toast.success(res.message);
                  fetchCustomers();
                  closeModal();
                } else {
                  toast.error(res.message);
                }
              }}
            />
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
    textAlign: "left",
    background: "#f9fafb",
    fontWeight: "600",
  },

  td: {
    border: "1px solid #e5e7eb",
    padding: "10px",
    textAlign: "left",
    verticalAlign: "middle",
  },

  tr: {
    transition: "0.2s",
  },

  editBtn: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "5px 10px",
    marginRight: "8px",
    borderRadius: "5px",
    cursor: "pointer",
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
    alignItems: "center",
    gap: "6px",
    marginTop: "15px",
  },

  pageBtn: {
    padding: "6px 10px",
    border: "1px solid #2a518b",
    background: "#010918",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "13px",
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
    width: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    borderBottom: "1px solid #eee",
    paddingBottom: "8px",
  },

  closeBtn: {
    border: "none",
    background: "#f3f4f6",
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};