/* Two footprints — alternate like a walking stride */

export function WalksIcon({ size = 22 }) {
  return (
    <svg
      className="skills-walks-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Back / left foot */}
      <g
        className="skills-walks-icon__foot skills-walks-icon__foot--left"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="8.2" cy="15.2" rx="2.35" ry="3.1" transform="rotate(-22 8.2 15.2)" />
        <circle cx="6.55" cy="10.35" r="1.05" />
        <circle cx="8.35" cy="9.55" r="1.05" />
        <circle cx="10.05" cy="10.15" r="0.95" />
      </g>

      {/* Front / right foot */}
      <g
        className="skills-walks-icon__foot skills-walks-icon__foot--right"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="15.6" cy="9.6" rx="2.35" ry="3.1" transform="rotate(18 15.6 9.6)" />
        <circle cx="14.05" cy="14.35" r="1.05" />
        <circle cx="15.85" cy="15.15" r="1.05" />
        <circle cx="17.55" cy="14.55" r="0.95" />
      </g>
    </svg>
  );
}
