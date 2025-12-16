import './ExperienceEntry.css'

interface ExperienceEntryProps {
  company: string
  title: string
  location: string
  start: string
  end: string
  start_year: number
  end_year: number
}

function ExperienceEntry({ 
  company, 
  title, 
  location, 
  start_year, 
  end_year
}: ExperienceEntryProps) {
  const formatYears = () => {
    if (start_year === end_year) {
      return start_year.toString()
    }
    return `${start_year} - ${end_year}`
  }

  return (
    <div className="experience-entry">
      <div className="experience-header">
        <span className="experience-company">{company}</span>
        <span className="experience-location">{location}</span>
        {/* <span className="experience-dates">{formatYears()}</span> */}
      </div>
      <span className="experience-title">{title}</span>
    </div>
  )
}

export default ExperienceEntry

