import api from "./api";

let settingsMemory = null;
let settingsInflight = null;

export function peekMeetingSettings() {
  return settingsMemory;
}

export async function getMeetingSettings() {
  if (settingsMemory) return settingsMemory;

  if (!settingsInflight) {
    settingsInflight = api
      .get("/api/meeting")
      .then(({ data }) => {
        settingsMemory = data;
        return data;
      })
      .finally(() => {
        settingsInflight = null;
      });
  }

  return settingsInflight;
}

export function prefetchMeetingSettings() {
  return getMeetingSettings().catch(() => peekMeetingSettings());
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
