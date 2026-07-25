import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./Dropdown.css";

/*
  Simple reusable dropdown.
  options: [{ id, label, meta? }]
*/

function Dropdown({
  label,
  value,
  options = [],
  onChange,
  placeholder = "Select",
  className = "",
}) {
  const listId = useId();
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selected = options.find((item) => item.id === value);
  const display = selected?.label || placeholder;

  useEffect(() => {
    function onPointer(event) {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    }

    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className={`dropdown${open ? " is-open" : ""}${className ? ` ${className}` : ""}`}
      ref={wrapRef}
    >
      {label ? <span className="dropdown__label">{label}</span> : null}

      <button
        type="button"
        className="dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="dropdown__value">{display}</span>
        <ChevronDown size={16} className="dropdown__chevron" aria-hidden="true" />
      </button>

      {open ? (
        <ul id={listId} className="dropdown__menu" role="listbox" aria-label={label || placeholder}>
          {options.map((item) => {
            const active = item.id === value;
            return (
              <li key={item.id} role="none">
                <button
                  type="button"
                  className={`dropdown__option${active ? " is-active" : ""}`}
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange?.(item.id);
                    setOpen(false);
                  }}
                >
                  <span className="dropdown__option-label">{item.label}</span>
                  {item.meta ? (
                    <span className="dropdown__option-meta">{item.meta}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export default Dropdown;
