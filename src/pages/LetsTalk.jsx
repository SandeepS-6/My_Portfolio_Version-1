import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getContactPage, peekContactPage } from "../services/contactPage";
import { getFooter, peekFooter } from "../services/footer";
import { bookMeeting } from "../services/meeting";
import MeetingScheduler from "../components/MeetingScheduler/MeetingScheduler";
import "./LetsTalk.css";

const emptyGuest = { name: "", email: "", subject: "", body: "" };

function LetsTalk() {
  const [copy, setCopy] = useState(() => peekContactPage());
  const [footer, setFooter] = useState(() => peekFooter());
  const [guest, setGuest] = useState(emptyGuest);
  const [selection, setSelection] = useState({
    selectedSlot: null,
    selectedDate: "",
    duration: 30,
    summary: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    getContactPage()
      .then((data) => {
        if (alive && data) setCopy(data);
      })
      .catch((err) => {
        console.warn("[contact] Failed to load page copy.", err.message);
      });

    getFooter()
      .then((data) => {
        if (alive && data) setFooter(data);
      })
      .catch((err) => {
        console.warn("[contact] Failed to load contact details.", err.message);
      });

    return () => {
      alive = false;
    };
  }, []);

  const handleSelectionChange = useCallback((next) => {
    setSelection(next);
    setError("");
  }, []);

  function onGuestChange(event) {
    const { name, value } = event.target;
    setGuest((prev) => ({ ...prev, [name]: value }));
  }

  async function onConfirm(event) {
    event.preventDefault();

    if (!selection.selectedSlot) {
      setError("Pick a time on the calendar first.");
      return;
    }

    setStatus("booking");
    setError("");

    try {
      await bookMeeting({
        guestName: guest.name.trim(),
        guestEmail: guest.email.trim(),
        subject: guest.subject.trim() || undefined,
        notes: guest.body.trim() || undefined,
        startAt: selection.selectedSlot.startAt,
        durationMin: selection.duration,
      });
      setStatus("booked");
    } catch (err) {
      setStatus("idle");
      setError(err.response?.data?.error || err.message || "Booking failed.");
    }
  }

  function resetBooking() {
    setStatus("idle");
    setGuest(emptyGuest);
    setError("");
  }

  const socials = footer?.socials || [];
  const email = footer?.email;
  const availability = footer?.availability?.label;
  const fields = copy?.fields || {};

  if (!copy) {
    return (
      <main className="contact-page" aria-label="Contact">
        <p className="contact-page__note">Loading…</p>
      </main>
    );
  }

  return (
    <main className="contact-page" aria-label="Contact">
      <div className="contact-page__glow" aria-hidden="true" />

      <header className="contact-page__top">
        <Link to="/" className="contact-page__back">
          <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
          {copy.backLabel}
        </Link>

        <div className="contact-page__meta">
          {availability && (
            <p className="contact-page__availability">{availability}</p>
          )}
          {email && (
            <a className="contact-page__email" href={`mailto:${email}`}>
              {email}
            </a>
          )}
        </div>
      </header>

      <div className="contact-page__intro">
        <p className="contact-page__eyebrow">{copy.eyebrow}</p>
        <h1 className="contact-page__title">{copy.title}</h1>
        <p className="contact-page__note">{copy.intro}</p>

        {copy.detail && <p className="contact-page__detail">{copy.detail}</p>}
        {copy.meetingNote && (
          <p className="contact-page__meeting-note">{copy.meetingNote}</p>
        )}

        {(copy.responseLabel || copy.responseValue) && (
          <p className="contact-page__response">
            <span>{copy.responseLabel}</span>
            <strong>{copy.responseValue}</strong>
          </p>
        )}
      </div>

      <div className="contact-page__booking">
        <div className="contact-page__panel">
          <MeetingScheduler
            hostEmail={email}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        <div className="contact-page__fields">
          {status === "booked" ? (
            <div className="contact-page__success">
              <p className="contact-page__success-title">{copy.successTitle}</p>
              <p className="contact-page__success-note">
                {copy.successNote}
                {selection.summary ? ` ${selection.summary}.` : ""}
              </p>
              <button
                type="button"
                className="contact-page__submit"
                onClick={resetBooking}
              >
                Book another
              </button>
            </div>
          ) : (
            <form className="contact-page__form" onSubmit={onConfirm}>
              <div className="contact-page__form-body">
                <p className="contact-page__form-kicker">Your details</p>
                {selection.summary && (
                  <p className="contact-page__form-meta">{selection.summary}</p>
                )}

                <label className="contact-page__field">
                  <span>{fields.name}</span>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    value={guest.name}
                    onChange={onGuestChange}
                  />
                </label>

                <label className="contact-page__field">
                  <span>{fields.email}</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={guest.email}
                    onChange={onGuestChange}
                  />
                </label>

                <label className="contact-page__field contact-page__field--wide">
                  <span>{fields.subject}</span>
                  <input
                    name="subject"
                    value={guest.subject}
                    onChange={onGuestChange}
                  />
                </label>

                <label className="contact-page__field contact-page__field--wide">
                  <span>{fields.body}</span>
                  <textarea
                    name="body"
                    rows={3}
                    required
                    value={guest.body}
                    onChange={onGuestChange}
                  />
                </label>

                {error && (
                  <p className="contact-page__error" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="contact-page__submit"
                disabled={status === "booking" || !selection.selectedSlot}
              >
                {status === "booking" ? copy.sendingLabel : copy.submitLabel}
              </button>
            </form>
          )}
        </div>
      </div>

      {socials.length > 0 && (
        <nav className="contact-page__socials" aria-label="Social">
          {socials.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </main>
  );
}

export default LetsTalk;
