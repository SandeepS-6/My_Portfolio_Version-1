/* Shared project search so mobile header + ProjectsSection stay in sync */
let query = "";
const listeners = new Set();

export function getProjectQuery() {
  return query;
}

export function setProjectQuery(next) {
  const value = typeof next === "string" ? next : "";
  if (value === query) return;
  query = value;
  listeners.forEach((listen) => listen(query));
}

export function subscribeProjectQuery(listen) {
  listeners.add(listen);
  return () => listeners.delete(listen);
}
