import api from "../api/axios";

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const createOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};