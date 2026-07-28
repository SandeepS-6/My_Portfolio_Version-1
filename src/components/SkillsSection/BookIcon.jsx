/* Open book — page turns around the spine */

export function BookIcon({ size = 22 }) {
  return (
    <svg
      className="skills-book-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cover + left page (stay put) */}
      <g
        className="skills-book-icon__base"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 5.5v13.2c0 .6.5 1 1.1.9 2.4-.4 4.2-.6 6.9.1V6.2c-2.5-.8-4.4-.6-6.9-.2C4.5 6.1 4 5.7 4 5.5z" />
        <path d="M12 6.2V19.7c2.7-.7 4.5-.5 6.9.1.6.1 1.1-.3 1.1-.9V5.5c0-.2-.5-.6-1.1-.5-2.5.4-4.4.2-6.9.2z" opacity="0.35" />
        <path d="M12 6.2V19.7" />
      </g>

      {/* Page that flips across the spine */}
      <g className="skills-book-icon__page">
        <path
          d="M12 6.4V19.5c2.2-.55 3.8-.4 5.9.05.45.08.85-.25.85-.7V5.7c0-.2-.4-.55-.9-.45-2.1.35-3.6.15-5.85.15z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          className="skills-book-icon__lines"
          d="M14.2 9.2h3.2M14.2 11.6h2.6M14.2 14h3"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}
