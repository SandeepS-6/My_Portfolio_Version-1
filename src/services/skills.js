import api from "./api";
import mockSkills from "../data/mockSkills";

/*
  Public portfolio skills service.
  Tries the API first; falls back to mock data if the API is down.
*/

export async function getSkills() {
  try {
    const { data } = await api.get("/api/skills", {
      params: { visible: "true" },
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("[skills] API unavailable — using mock data.", error.message);
    return mockSkills
      .filter((skill) => skill.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
}
