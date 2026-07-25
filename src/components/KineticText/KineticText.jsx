import "./KineticText.css";

/*
  Letter-by-letter hover weight ripple (no library).
  Used in Hero for name + headline.
*/

const TAGS = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  p: "p",
  span: "span",
};

function KineticText({ text, as = "h1", className = "", ...rest }) {
  const Tag = TAGS[as] || "h1";
  const classes = className ? `kinetic-text ${className}` : "kinetic-text";

  return (
    <Tag className={classes} {...rest}>
      {text.split("").map((letter, i) => (
        <span key={i} aria-hidden="true" className="kinetic-text__letter">
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
      <span className="kinetic-text__sr">{text}</span>
    </Tag>
  );
}

export default KineticText;
