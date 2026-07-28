import api from "./api";
import { mockSkillsSection } from "../data/mockSkillsSection";

function isSkillsSectionPayload(data) {
  return data && !Array.isArray(data) && Array.isArray(data.categories);
}

export async function getSkillsSection() {
  try {
    const { data } = await api.get("/api/skills-section");
    if (isSkillsSectionPayload(data)) return data;
  } catch (error) {
    console.warn("[skills-section] API unavailable, using mock.", error.message);
  }

  return mockSkillsSection;
}
