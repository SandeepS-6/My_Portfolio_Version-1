import api from "./api";
import { mockAbout } from "../data/mockAbout";

function isAboutPayload(data) {
  return data && !Array.isArray(data) && typeof data.name === "string" && data.name;
}

export async function getAbout() {
  try {
    const { data } = await api.get("/api/about");
    if (isAboutPayload(data)) return data;
  } catch (error) {
    console.warn("[about] API unavailable, using mock.", error.message);
  }

  return mockAbout;
}
