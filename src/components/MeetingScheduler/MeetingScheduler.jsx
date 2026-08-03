import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import {
  getMeetingSettings,
  getMeetingSlots,
  peekMeetingSettings,
} from "../../services/meeting";
import GoogleMeetIcon from "./GoogleMeetIcon";
import {
  WEEKDAYS,
  buildMonthCells,
  durationLabel,
  formatMonthLabel,
  formatSelectedDay,
  shiftMonth,
  todayKeyLocal,
} from "../../utils/MeetingScheduler/meetingCalendar";
import { mediaUrl } from "../../utils/mediaUrl";
import "./MeetingScheduler.css";

function MeetingScheduler({ hostEmail, hostImageUrl, onSelectionChange }) {
  const [settings, setSettings] = useState(() => peekMeetingSettings());
  const [duration, setDuration] = useState(
    () => peekMeetingSettings()?.durations?.[0] || 30,
  );
  const [hour12, setHour12] = useState(true);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState(todayKeyLocal());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  const todayKey = todayKeyLocal();

  useEffect(() => {
    let alive = true;
    getMeetingSettings()
      .then((data) => {
        if (!alive || !data) return;
        setSettings(data);
        setDuration(data.durations?.[0] || 30);
      })
      .catch((err) => {
        if (alive) setError(err.response?.data?.error || err.message);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!settings) return undefined;

    let alive = true;
    setLoadingSlots(true);
    setSelectedSlot(null);
    setError("");

    getMeetingSlots({ date: selectedDate, duration })
      .then((data) => {
        if (!alive) return;
        setSlots(data.slots || []);
      })
      .catch((err) => {
        if (!alive) return;
        setSlots([]);
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        if (alive) setLoadingSlots(false);
      });

    return () => {
      alive = false;
    };
  }, [selectedDate, duration, settings]);

  useEffect(() => {
    if (!onSelectionChange || !settings) return;
    onSelectionChange({
      selectedSlot,
      selectedDate,
      duration,
      settings,
      summary: selectedSlot
        ? `${formatSelectedDay(selectedDate)} · ${selectedSlot.label} · ${duration} min`
        : "",
    });
  }, [selectedSlot, selectedDate, duration, settings, onSelectionChange]);

  const cells = useMemo(
    () =>
      buildMonthCells(
        month.year,
        month.monthIndex,
        todayKey,
        settings?.workDays || [],
      ),
    [month, todayKey, settings?.workDays],
  );

  if (!settings) {
    return (
      <div className="meeting-scheduler" aria-label="Meeting scheduler">
        <p className="meeting-scheduler__empty">Loading scheduler…</p>
      </div>
    );
  }

  const initials =
    settings.hostInitials ||
    String(settings.hostName || "S")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  const avatarSrc = mediaUrl(settings.hostImageUrl || hostImageUrl);

  return (
    <div className="meeting-scheduler" aria-label="Meeting scheduler">
      <header className="meeting-scheduler__bar">
        <div className="meeting-scheduler__host">
          {avatarSrc ? (
            <img
              className="meeting-scheduler__avatar meeting-scheduler__avatar--photo"
              src={avatarSrc}
              alt=""
            />
          ) : (
            <span className="meeting-scheduler__avatar" aria-hidden="true">
              {initials}
            </span>
          )}
          <div>
            <p className="meeting-scheduler__host-name">{settings.hostName}</p>
            <p className="meeting-scheduler__title">{duration} min meeting</p>
            {hostEmail && (
              <a
                className="meeting-scheduler__host-email"
                href={`mailto:${hostEmail}`}
              >
                {hostEmail}
              </a>
            )}
          </div>
        </div>

        <div
          className="meeting-scheduler__durations"
          role="group"
          aria-label="Duration"
        >
          {(settings.durations || [30, 60]).map((mins) => (
            <button
              key={mins}
              type="button"
              className={`meeting-scheduler__chip${
                duration === mins ? " meeting-scheduler__chip--active" : ""
              }`}
              onClick={() => setDuration(mins)}
            >
              {durationLabel(mins)}
            </button>
          ))}
        </div>

        <div className="meeting-scheduler__bar-meta">
          <span className="meeting-scheduler__meta">
            <span className="meeting-scheduler__meet-icon">
              <GoogleMeetIcon size={14} />
            </span>
            {settings.locationLabel}
          </span>
          <span className="meeting-scheduler__meta">
            <Globe size={14} aria-hidden="true" />
            {settings.timezone}
          </span>
        </div>
      </header>

      <div className="meeting-scheduler__pick">
        <section className="meeting-scheduler__calendar" aria-label="Pick a date">
          <div className="meeting-scheduler__month-bar">
            <p>{formatMonthLabel(month.year, month.monthIndex)}</p>
            <div className="meeting-scheduler__month-nav">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() =>
                  setMonth((prev) => shiftMonth(prev.year, prev.monthIndex, -1))
                }
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() =>
                  setMonth((prev) => shiftMonth(prev.year, prev.monthIndex, 1))
                }
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="meeting-scheduler__weekdays">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="meeting-scheduler__grid">
            {cells.map((cell) =>
              cell.type === "empty" ? (
                <span
                  key={cell.key}
                  className="meeting-scheduler__cell meeting-scheduler__cell--empty"
                />
              ) : (
                <button
                  key={cell.key}
                  type="button"
                  disabled={cell.disabled}
                  className={[
                    "meeting-scheduler__cell",
                    cell.disabled ? "meeting-scheduler__cell--disabled" : "",
                    selectedDate === cell.dateKey
                      ? "meeting-scheduler__cell--selected"
                      : "",
                    cell.isToday ? "meeting-scheduler__cell--today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setSelectedDate(cell.dateKey)}
                >
                  {cell.day}
                </button>
              ),
            )}
          </div>
        </section>

        <section className="meeting-scheduler__slots" aria-label="Pick a time">
          <div className="meeting-scheduler__slots-head">
            <p>{formatSelectedDay(selectedDate)}</p>
            <div
              className="meeting-scheduler__hour-toggle"
              role="group"
              aria-label="Time format"
            >
              <button
                type="button"
                className={hour12 ? "is-active" : ""}
                onClick={() => setHour12(true)}
              >
                12h
              </button>
              <button
                type="button"
                className={!hour12 ? "is-active" : ""}
                onClick={() => setHour12(false)}
              >
                24h
              </button>
            </div>
          </div>

          <div className="meeting-scheduler__slot-list">
            {loadingSlots && (
              <p className="meeting-scheduler__empty">Loading times…</p>
            )}
            {!loadingSlots && slots.length === 0 && (
              <p className="meeting-scheduler__empty">No times open this day.</p>
            )}
            {!loadingSlots &&
              slots.map((slot) => (
                <button
                  key={slot.startAt}
                  type="button"
                  disabled={!!slot.booked}
                  className={[
                    "meeting-scheduler__slot",
                    slot.booked ? "meeting-scheduler__slot--booked" : "",
                    selectedSlot?.startAt === slot.startAt
                      ? "meeting-scheduler__slot--selected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    if (slot.booked) return;
                    setSelectedSlot(slot);
                    setError("");
                  }}
                >
                  <span>{hour12 ? slot.label : slot.label24}</span>
                  {slot.booked && (
                    <span className="meeting-scheduler__slot-note">Booked</span>
                  )}
                </button>
              ))}
          </div>

          {error && <p className="meeting-scheduler__error">{error}</p>}
        </section>
      </div>
    </div>
  );
}

export default MeetingScheduler;
