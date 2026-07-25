import SkillItem from "./SkillItem";
import "./SkillGroup.css";

function SkillGroup({ title, skills }) {
  if (!skills?.length) return null;

  return (
    <div className="skill-group">
      {title ? <h3 className="skill-group__title">{title}</h3> : null}
      <ul className="skill-group__list">
        {skills.map((skill) => (
          <SkillItem key={skill.id} skill={skill} />
        ))}
      </ul>
    </div>
  );
}

export default SkillGroup;
