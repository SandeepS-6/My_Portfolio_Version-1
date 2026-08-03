const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toDateKey(year, monthIndex, day) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, monthIndex: month - 1, day };
}

export function formatMonthLabel(year, monthIndex) {
  return `${MONTHS[monthIndex]} ${year}`;
}

export function formatSelectedDay(dateKey) {
  const { year, monthIndex, day } = parseDateKey(dateKey);
  const date = new Date(year, monthIndex, day);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  return `${weekday} ${day}`;
}

export function shiftMonth(year, monthIndex, delta) {
  const date = new Date(year, monthIndex + delta, 1);
  return { year: date.getFullYear(), monthIndex: date.getMonth() };
}

export function buildMonthCells(year, monthIndex, todayKey, workDays = []) {
  const first = new Date(year, monthIndex, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startPad; i += 1) {
    cells.push({ type: "empty", key: `e-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = toDateKey(year, monthIndex, day);
    const weekday = new Date(year, monthIndex, day).getDay();
    const isPast = dateKey < todayKey;
    const isWorkDay = workDays.includes(weekday);
    cells.push({
      type: "day",
      key: dateKey,
      day,
      dateKey,
      disabled: isPast || !isWorkDay,
      isToday: dateKey === todayKey,
    });
  }

  return cells;
}

export function todayKeyLocal() {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

export function durationLabel(minutes) {
  if (minutes % 60 === 0) return `${minutes / 60}h`;
  return `${minutes}m`;
}

export { WEEKDAYS, MONTHS };
