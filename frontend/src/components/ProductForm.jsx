import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ProductForm({ editProduct, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= BIND EDIT DATA =================
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || "",
        sku: editProduct.sku || "",
        price: editProduct.price || "",
        quantity: editProduct.quantity || "",
      });
    } else {
      setForm({
        name: "",
        sku: "",
        price: "",
        quantity: "",
      });
    }
  }, [editProduct]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

        if(!form.name){
            toast.warn("Product Name cannot be empty!");
            return;
        }
        if(!form.sku){
            toast.warn("SKU cannot be empty!");
            return;
        }
        if(!form.price){
            toast.warn("Price cannot be empty!");
            return;
        }
        if(parseFloat(form.price) < 0){
            toast.warn("Please enter valid price!");
            return;
        }
        if(!form.quantity){
            toast.warn("Quantity cannot be empty!");
            return;
        }
        if(parseInt(form.quantity) < 0){
            toast.warn("Please enter valid quantity!");
            return;
        }
      let res;

      // ========== EDIT ==========
      if (editProduct) {
        res = await api.put(`/products/${editProduct.id}`, {
          name: form.name,
          sku: form.sku,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
        });
      }
      // ========== ADD ==========
      else {
        res = await api.post("/products", {
          name: form.name,
          sku: form.sku,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
        });
      }

      const data = res.data;

      // send response to parent (for toast handling)
      onSuccess?.(data);

      // reset only on success
      if (data.status === "success") {
        setForm({
          name: "",
          sku: "",
          price: "",
          quantity: "",
        });
      }
    } catch (err) {
      onSuccess?.({
        status: "false",
        message:
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Something went wrong",
        data: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 style={styles.title}>
        {editProduct ? "✏️ Edit Product" : "➕ Add Product"}
      </h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="sku"
          placeholder="SKU Code"
          value={form.sku}
          onChange={handleChange}
          style={styles.input}
        />

        <div style={styles.row}>
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={handleChange}
            style={styles.smallInput}
          />

          <input
            name="quantity"
            placeholder="Qty"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            style={styles.smallInput}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading
            ? "Processing..."
            : editProduct
            ? "Update Product"
            : "Add Product"}
        </button>
      </form>
    </>
  );
}

/* ================= STYLES ================= */
const styles = {
  title: {
    marginBottom: "12px",
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "13px",
    width: "95%",
    outline: "none",
  },

  row: {
    display: "flex",
    gap: "10px",
  },

  smallInput: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "13px",
    outline: "none",
  },

  button: {
    padding: "8px 10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    width: "140px",
    alignSelf: "center",
  },
};