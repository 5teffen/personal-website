import './Skills.css'

interface Skill {
  name: string
  rating: number
}

interface SkillsProps {
  skills: Skill[]
}

function Skills({ skills }: SkillsProps) {
  return (
    <div className="skills-container">
      <div className="skills-list">
        {skills.map((skill, index) => (
          <div key={index} className="skill-item">
            <div className="skill-name">{skill.name}</div>
            <div className="skill-rating">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`skill-bubble ${i < skill.rating ? 'filled' : 'empty'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills

