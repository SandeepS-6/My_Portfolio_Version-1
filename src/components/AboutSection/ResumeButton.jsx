import { DownloadIcon } from "./AboutIcons";
import { mediaUrl } from "../../utils/mediaUrl";
import "./ResumeButton.css";

function ResumeButton({
  label = "Download Resume",
  href,
  fileName = "Sandeep_Saliganti_Resume.pdf",
}) {
  const resolvedHref = mediaUrl(href);

  if (!resolvedHref) {
    return (
      <button className="about-resume" type="button" aria-label={label} disabled>
        <span className="about-resume__icon" aria-hidden="true">
          <DownloadIcon />
        </span>
        <span className="about-resume__label">{label}</span>
        <span className="about-resume__ripple" aria-hidden="true" />
      </button>
    );
  }

  return (
    <a
      className="about-resume"
      href={resolvedHref}
      download={fileName}
      aria-label={label}
    >
      <span className="about-resume__icon" aria-hidden="true">
        <DownloadIcon />
      </span>
      <span className="about-resume__label">{label}</span>
      <span className="about-resume__ripple" aria-hidden="true" />
    </a>
  );
}

export default ResumeButton;
