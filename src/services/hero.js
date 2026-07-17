import api from "./api";
import mockHero from "../data/mockHero";

export async function getHero() {
  try {
    const { data } = await api.get("/api/hero");
    return data;
  } catch (error) {
    console.warn("[hero] API unavailable — using mock data.", error.message);
    return mockHero;
  }
}
