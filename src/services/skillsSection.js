import api from "./api";

function isSkillsSectionPayload(data) {
  return (
    data &&
    !Array.isArray(data) &&
    Array.isArray(data.skills)
  );
}

export async function getSkillsSection() {
  const { data } = await api.get("/api/skills-section");
  if (!isSkillsSectionPayload(data)) {
    throw new Error("Skills section API returned an unexpected shape.");
  }
  return data;
}
