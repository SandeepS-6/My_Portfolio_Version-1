import "./Button.css";

/*
  Simple reusable button.
  - variant: "primary" | "secondary"
  - asLink: if true, renders an <a> (good for "Download Resume")
*/

function Button({
  children,
  variant = "primary",
  asLink = false,
  href = "#",
  type = "button",
  onClick,
}) {
  const className = `btn btn--${variant}`;

  if (asLink) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
