import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function OrderForm({ onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
      ]);

      setCustomers(cRes.data.data);
      setProducts(pRes.data.data);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= ITEM HANDLERS =================
  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // ================= TOTAL CALC =================
  const getTotal = () => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === Number(item.product_id));

      if (!product) return sum;

      return sum + product.price * item.quantity;
    }, 0);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      toast.error("Select customer!");
      return;
    }
    const invalidItem = items.find((i) => !i.product_id || i.product_id === "");

    if (invalidItem) {
      toast.error("Select product!");
      return;
    }

    try {
      const payload = {
        customer_id: Number(customerId),
        items: items.map((i) => ({
          product_id: Number(i.product_id),
          quantity: Number(i.quantity),
        })),
      };

      const res = await api.post("/orders", payload);

      if (res.data.status) {
        toast.success(res.data.message);
        setCustomerId("");
        setItems([{ product_id: "", quantity: 1 }]);
        onSuccess && onSuccess();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Order failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.title}>Create Order</h3>

      {/* CUSTOMER SELECT */}
      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        style={styles.input}
      >
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.full_name}
          </option>
        ))}
      </select>

      {/* PRODUCTS */}
      {items.map((item, index) => (
        <div key={index} style={styles.row}>
          <select
            value={item.product_id}
            onChange={(e) => updateItem(index, "product_id", e.target.value)}
            style={styles.smallInput}
          >
            <option value="">Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₹{p.price})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateItem(index, "quantity", e.target.value)}
            style={styles.smallInput}
          />

          <button
            type="button"
            onClick={() => removeItem(index)}
            style={styles.removeBtn}
          >
            ✕
          </button>
        </div>
      ))}

      {/* ADD ITEM */}
      <button type="button" onClick={addItem} style={styles.addBtn}>
        + Add Product
      </button>

      {/* TOTAL */}
      <div style={styles.total}>Total: ₹{getTotal()}</div>

      {/* SUBMIT */}
      <button type="submit" style={styles.button}>
        Place Order
      </button>
    </form>
  );
}

/* ================= STYLES ================= */
const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  title: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "600",
  },

  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "13px",
  },

  row: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  smallInput: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "13px",
  },

  addBtn: {
    padding: "6px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },

  removeBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  total: {
    textAlign: "right",
    fontWeight: "600",
    marginTop: "5px",
  },

  button: {
    padding: "8px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
