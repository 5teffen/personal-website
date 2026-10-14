import './EducationEntry.css'

interface EducationEntryProps {
  school?: string
  company?: string
  degree: string
  years?: string
}

function EducationEntry({ school, company, degree, years }: EducationEntryProps) {
  const institution = school || company

  return (
    <div className="education-entry">
      <div className="entry-header">
        <span className="education-school">{institution}</span>
        {years && <span className="entry-years">{years}</span>}
      </div>
      <div className="education-degree">{degree}</div>
    </div>
  )
}

export default EducationEntry
