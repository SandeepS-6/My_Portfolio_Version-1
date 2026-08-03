import "./Button.css";

/*
  Premium CTA: label + arrow circle as one clickable control.
  - variant: "primary" | "secondary"
  - asLink: if true, renders an <a> (good for "Download Resume")
*/

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Button({
  children,
  variant = "primary",
  asLink = false,
  href = "#",
  type = "button",
  onClick,
  download,
  target,
  rel,
}) {
  const className = `btn btn--${variant}`;

  const content = (
    <>
      <span className="btn__label">
        <span className="btn__text">{children}</span>
        <span className="btn__shine" aria-hidden="true" />
      </span>
      <span className="btn__arrow" aria-hidden="true">
        <ArrowIcon />
      </span>
    </>
  );

  if (asLink) {
    return (
      <a
        className={className}
        href={href}
        download={download || undefined}
        target={target}
        rel={rel}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick}>
      {content}
    </button>
  );
}

export default Button;
