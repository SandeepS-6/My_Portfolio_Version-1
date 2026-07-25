import api from "./api";

export async function getMeetingSettings() {
  const { data } = await api.get("/api/meeting");
  return data;
}

export async function getMeetingSlots({ date, duration }) {
  const { data } = await api.get("/api/meeting/slots", {
    params: { date, duration },
  });
  return data;
}

export async function bookMeeting(payload) {
  const { data } = await api.post("/api/meeting/bookings", payload);
  return data;
}
