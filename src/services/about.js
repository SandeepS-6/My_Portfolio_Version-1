import api from "./api";

function isAboutPayload(data) {
  return data && !Array.isArray(data) && typeof data.name === "string" && data.name;
}

export async function getAbout() {
  const { data } = await api.get("/api/about");
  if (!isAboutPayload(data)) {
    throw new Error("About API returned an unexpected shape.");
  }
  return data;
}
