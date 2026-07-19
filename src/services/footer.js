import api from "./api";
import mockFooter from "../data/mockFooter";

export async function getFooter() {
  try {
    const { data } = await api.get("/api/footer");
    return data;
  } catch (error) {
    console.warn("[footer] API unavailable — using mock data.", error.message);
    return mockFooter;
  }
}
