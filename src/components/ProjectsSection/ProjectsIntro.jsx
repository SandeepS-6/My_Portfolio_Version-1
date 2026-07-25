import Highlighter from "../Highlighter/Highlighter";
import "./ProjectsIntro.css";

function ProjectsIntro({ intro }) {
  if (!intro) return null;

  const {
    quote,
    attribution,
    highlightColor = "#f17a32",
    underlineColor = "#87CEFA",
  } = intro;

  if (!quote) return null;

  return (
    <header className="projects-intro" data-summary-block>
      <blockquote className="projects-intro__quote">
        {quote.before ? <>{quote.before} </> : null}
        {quote.mark ? (
          <Highlighter action="highlight" color={highlightColor} isView>
            {quote.mark}
          </Highlighter>
        ) : null}
        {quote.mid ? <> {quote.mid} </> : null}
        {quote.underline ? (
          <Highlighter action="underline" color={underlineColor} isView>
            {quote.underline}
          </Highlighter>
        ) : null}
        {quote.after ? <> {quote.after}</> : null}
      </blockquote>

      {attribution ? (
        <p className="projects-intro__attribution">{attribution}</p>
      ) : null}
    </header>
  );
}

export default ProjectsIntro;
