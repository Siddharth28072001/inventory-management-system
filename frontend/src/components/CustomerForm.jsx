import { useEffect, useState } from "react";
import { createCustomer, updateCustomer } from "../services/customerService";
import { toast } from "react-toastify";
export default function CustomerForm({ editCustomer, onSuccess }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= LOAD EDIT DATA =================
  useEffect(() => {
    if (editCustomer) {
      setForm({
        full_name: editCustomer.full_name || "",
        email: editCustomer.email || "",
        phone_number: editCustomer.phone_number || "",
      });
    }
  }, [editCustomer]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name) {
      toast.warn("Name cannot be empty!");
      return;
    }
    if (!form.email) {
      toast.warn("Email cannot be empty!");
      return;
    }
    if (!form.phone_number) {
      toast.warn("Phone Number cannot be empty!");
      return;
    }
    setLoading(true);

    let res;

    if (editCustomer) {
      res = await updateCustomer(editCustomer.id, form);
    } else {
      res = await createCustomer(form);
    }

    setLoading(false);
    onSuccess(res);
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
        {loading
          ? "Saving..."
          : editCustomer
            ? "Update Customer"
            : "Create Customer"}
      </button>
    </form>
  );
}

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
