import api from "./api";

export async function getHero() {
  const { data } = await api.get("/api/hero");
  return data;
}
