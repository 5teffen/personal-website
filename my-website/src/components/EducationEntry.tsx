import './EducationEntry.css'

interface EducationEntryProps {
  school?: string
  company?: string
  degree: string
}

function EducationEntry({ school, company, degree }: EducationEntryProps) {
  const institution = school || company

  return (
    <div className="education-entry">
      <div className="education-school">{institution}</div>
      <div className="education-degree">{degree}</div>
    </div>
  )
}

export default EducationEntry

