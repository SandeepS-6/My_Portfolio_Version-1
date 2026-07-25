import api from "./api";

export async function getFooter() {
  const { data } = await api.get("/api/footer");
  return data;
}
