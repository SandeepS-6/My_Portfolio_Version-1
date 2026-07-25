import api from "./api";

export async function getSkills() {
  const { data } = await api.get("/api/skills", {
    params: { visible: "true" },
  });
  return Array.isArray(data) ? data : [];
}
