import { useState } from "react";
import { createCustomer } from "../services/customerService";
import { toast } from "react-toastify";

export default function CustomerForm({ onSuccess }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name) return toast.warn("Name cannot be empty!");
    if (!form.email) return toast.warn("Email cannot be empty!");
    if (!form.phone_number) return toast.warn("Phone Number cannot be empty!");

    setLoading(true);

    try {
      const res = await createCustomer(form);
      onSuccess(res);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* FULL NAME */}
      <input
        name="full_name"
        placeholder="Full Name"
        value={form.full_name}
        onChange={handleChange}
        style={styles.input}
      />

      {/* EMAIL */}
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={styles.input}
      />

      {/* PHONE */}
      <input
        name="phone_number"
        placeholder="Phone Number"
        value={form.phone_number}
        onChange={handleChange}
        style={styles.input}
      />

      {/* BUTTON */}
      <button type="submit" style={styles.btn} disabled={loading}>
        {loading ? "Saving..." : "Create Customer"}
      </button>
    </form>
  );
}

/* ================= STYLES ================= */
const styles = {
  input: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "13px",
    width: "95%",
    outline: "none",
    marginBottom: "10px",
  },

  btn: {
    padding: "8px 10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    width: "140px",
  },
};