import './ExperienceEntry.css'

interface ExperienceEntryProps {
  company: string
  title: string
  location: string
  years?: string
}

function ExperienceEntry({ company, title, location, years }: ExperienceEntryProps) {
  return (
    <div className="experience-entry">
      <div className="entry-header">
        <span className="experience-company">{company}</span>
        <span className="experience-location">{location}</span>
        {years && <span className="entry-years">{years}</span>}
      </div>
      <span className="experience-title">{title}</span>
    </div>
  )
}

export default ExperienceEntry
