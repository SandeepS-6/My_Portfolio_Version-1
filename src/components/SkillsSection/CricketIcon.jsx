/* Cricket bat + ball — line icon matching skills tile style */

export function CricketIcon({ size = 22 }) {
  return (
    <svg
      className="skills-cricket-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="skills-cricket-icon__bat" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {/* handle */}
        <path d="M7.2 16.8 L5.4 18.6" />
        <path d="M6.1 15.7 L8.3 17.9" />
        {/* blade */}
        <path d="M8.2 14.6 L16.6 6.2c.7-.7 1.8-.7 2.5 0l.7.7c.7.7.7 1.8 0 2.5L11.4 17.8c-.4.4-1 .5-1.5.3L8.2 14.6z" />
        <path d="M10.2 16.4 L15.8 10.8" opacity="0.45" />
      </g>
      <circle
        className="skills-cricket-icon__ball"
        cx="7.2"
        cy="8.2"
        r="2.05"
        stroke="currentColor"
        strokeWidth="1.75"
        fill="none"
      />
      <path
        className="skills-cricket-icon__seam"
        d="M6.2 7.1 C6.8 7.6 7.6 8.5 7.9 9.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
