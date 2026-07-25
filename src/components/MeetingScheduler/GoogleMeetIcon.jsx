/* Multicolor Google Meet camera mark */
function GoogleMeetIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#00832D"
        d="M4.5 5.25h8.25A1.5 1.5 0 0 1 14.25 6.75v10.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 17.25V6.75a1.5 1.5 0 0 1 1.5-1.5z"
      />
      <path
        fill="#00AC47"
        d="M4.5 5.25h5.25v13.5H4.5A1.5 1.5 0 0 1 3 17.25V6.75a1.5 1.5 0 0 1 1.5-1.5z"
      />
      <path fill="#FFBA00" d="M9.75 5.25H12.75V12L9.75 11.25V5.25z" />
      <path fill="#0066DA" d="M9.75 12L12.75 12.75V18.75H9.75V12z" />
      <path
        fill="#2684FC"
        d="M14.25 9.6v4.8L21 18V6l-6.75 3.6z"
      />
      <path fill="#00AC47" d="M12.75 5.25h1.5A1.5 1.5 0 0 1 15.75 6.75V9.6L12.75 8V5.25z" />
      <path fill="#0066DA" d="M12.75 16V18.75h1.5a1.5 1.5 0 0 0 1.5-1.5v-2.85L12.75 16z" />
    </svg>
  );
}

export default GoogleMeetIcon;
