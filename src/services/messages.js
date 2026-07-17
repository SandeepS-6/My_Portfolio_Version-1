import api from "./api";

export async function sendMessage(payload) {
  const { data } = await api.post("/api/messages", payload);
  return data;
}
