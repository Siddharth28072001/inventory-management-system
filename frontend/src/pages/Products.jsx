import { useEffect, useState, useMemo } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import ProductForm from "../components/ProductForm";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ================= FETCH =================
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();

      if (res?.status) {
        const data = res.data || [];
        setProducts(Array.isArray(data) ? data : []);
      } else {
        toast.error(res?.message || "Failed to fetch products");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setLoading(true);
    try {
      const res = await deleteProduct(id);

      if (res?.status) {
        toast.success(res.message || "Product deleted");
        fetchProducts();
      } else {
        toast.error(res?.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= MODAL =================
  const openAddModal = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
  };

  // ================= PAGINATION =================
  const totalPages = useMemo(
    () => Math.ceil(products.length / pageSize),
    [products.length],
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage]);

  const goToPage = (page) => setCurrentPage(page);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Loader
  if (loading) return <Loader />;

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Products</h2>

        <button style={styles.addBtn} onClick={openAddModal}>
          + Add Product
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.tableBox}>
       
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p, index) => (
                  <tr key={p.id}>
                    <td style={styles.td}>
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>

                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{p.sku}</td>
                    <td style={styles.td}>₹{p.price}</td>
                    <td style={styles.td}>{p.quantity}</td>

                    <td style={styles.td}>
                      <button
                        style={styles.editBtn}
                        onClick={() => openEditModal(p)}
                      >
                        Edit
                      </button>

                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
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

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>

              <button style={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>

            <ProductForm
              editProduct={editProduct}
              onSuccess={(res) => {
                if (res?.status) {
                  toast.success(res.message || "Success");
                  fetchProducts();
                  closeModal();
                } else {
                  toast.error(res?.message || "Failed");
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
    width: "420px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
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
    fontWeight: "bold",
  },
};
