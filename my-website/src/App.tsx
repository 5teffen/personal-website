import { useEffect, useState } from 'react'
import './App.css'
// import Skills from './components/Skills'
import EducationEntry from './components/EducationEntry'
import ExperienceEntry from './components/ExperienceEntry'
import PublicationEntry from './components/PublicationEntry'
import Announcement from './components/Announcement'
import { formatYears } from './utils/years'
import type { PublicationLinkMap } from './components/PublicationLinks'
import aboutData from './data/about.json'
import publicationsData from './data/publications.json'
import backgroundImage from './assets/image.png'
import profileImage from './assets/profile.jpg'

// interface Skill {
//   name: string
//   rating: number
// }

interface Education {
  school?: string
  company?: string
  degree: string
  start_year?: number
  end_year?: number
}

interface Publication {
  title: string
  authors: string[]
  venue: string
  year: number
  status?: string
  award?: string
  links?: PublicationLinkMap
  firstAuthor?: boolean
}

const isUnderReview = (pub: Publication) => /under review/i.test(pub.venue)

/** Newest first. Within a year, first-authored before collaborations, then JSON order. */
const byYearThenAuthorship = (a: Publication, b: Publication) =>
  b.year - a.year || Number(!!b.firstAuthor) - Number(!!a.firstAuthor)

interface Experience {
  company: string
  title: string
  location: string
  start: string
  end: string
  start_year: number
  end_year: number
  description?: string[]
}

function App() {
  const [about, setAbout] = useState<string>('')
  const [education, setEducation] = useState<Education[]>([])
  // const [skills, setSkills] = useState<Skill[]>([])
  const [published, setPublished] = useState<Publication[]>([])
  const [underReview, setUnderReview] = useState<Publication[]>([])
  const [experience, setExperience] = useState<Experience[]>([])

  useEffect(() => {
    // Load about text
    setAbout(aboutData.about)
    
    // Load education data
    const edu: Education[] = aboutData.education.map(edu => ({
      school: edu.school || edu.company,
      degree: edu.degree,
      start_year: edu.start_year,
      end_year: edu.end_year,
    }))
    setEducation(edu)

    // Load skills data
    // if (Array.isArray(aboutData.skills)) {
    //   setSkills(aboutData.skills)
    // }

    // Published work first, then work under review, each sorted by year and authorship
    const allPubs: Publication[] = [
      ...publicationsData.first_author.map(p => ({ ...p, firstAuthor: true })),
      ...publicationsData.collaboration.map(p => ({ ...p, firstAuthor: false })),
    ]
    setPublished(allPubs.filter(p => !isUnderReview(p)).sort(byYearThenAuthorship))
    setUnderReview(allPubs.filter(isUnderReview).sort(byYearThenAuthorship))

    // Load experience data - only professional
    const exp: Experience[] = aboutData.experience.professional
    setExperience(exp)
  }, [])


  return (
    <>
      <div className="app-grid">
        <main className="main-content">
          <div className="content-box">
            <div className="inner-grid" style={{ backgroundImage: `url(${backgroundImage})` }}>
              <div className="one-box first-box name-panel">
                <img className="profile-photo" src={profileImage} alt="Portrait of Steffen Holter" />
                <p className="all-text first-name">Steffen</p>
                <p className="all-text last-name">HOLTER</p>
              </div>
              <div className="one-box first-box about-panel">
                {/* Soft accent: a short rule, CV, a short rule, ending on the text's right edge */}
                <header className="site-header">
                  <a className="cv-link" href={aboutData.cv} target="_blank" rel="noopener noreferrer">
                    <span>View CV</span>
                  </a>
                </header>
                {aboutData.looking_for && (
                  <Announcement
                    label="Looking for:"
                    lead={aboutData.looking_for.lead}
                    topics={aboutData.looking_for.topics}
                  />
                )}
                <p className="all-text section-title">About</p>
              </div>

              <div className="one-box left-content-1 limiter">
                <div className="links-container">
                  <div className="links-list">
              <a className="social-link" href="mailto:steffen.holter@inf.ethz.ch.com">
                        <i className="fas fa-envelope icon" style={{ color: '#515151' }}></i>
                    </a>     
                <a className="social-link" href="https://github.com/5teffen">
                          <i className="fab fa-github icon" style={{ color: '#333' }}></i>
                      </a>
                      <a className="social-link" href="https://www.linkedin.com/in/steffenholter/">
                          <i className="fab fa-linkedin-in icon" style={{ color: '#0077b5' }}></i>
                      </a>                
                      <a className="social-link" href="https://scholar.google.com/citations?user=Wv49UzsAAAAJ&hl=en&oi=ao">
                          <i className="fa fa-graduation-cap icon" style={{ color: '#515151' }}></i>
                      </a>
                  </div>
                </div>
                <div className="section-title-container">
                  {/* <p className="all-text section-title">Education</p> */}
                </div>
              </div>

              <div className="one-box right-content-1 limiter">
                <div className="about-text-container">
                  <p className="all-text">{about}</p>
                </div>
                <div className="section-title-container">
                  <p className="all-text section-title">Education</p>
                </div>
              </div>

              <div className="one-box left-content-2 ">
                <div className="education-text-container">
                  {/* <div className="education-list">
                    {education.map((edu, index) => (
                      <EducationEntry
                        key={index}
                        school={edu.school}
                        company={edu.company}
                        degree={edu.degree}
                      />
                    ))}
                  </div> */}
                </div>
                <div className="section-title-container">
                  {/* <p className="all-text section-title">Skills</p> */}
                </div>
              </div>

              <div className="one-box right-content-2">
                <div className="education-text-container">
                  <div className="education-list">
                    {education.map((edu, index) => (
                      <EducationEntry
                        key={index}
                        school={edu.school}
                        company={edu.company}
                        degree={edu.degree}
                        years={formatYears(edu.start_year, edu.end_year)}
                      />
                    ))}
                  </div>
                </div>
                <div className="section-title-container">
                  <p className="all-text section-title">Experience</p>
                </div>
              </div>

              <div className="one-box right-content-3 limiter">
                <div className="experience-text-container">
                  <div className="experience-list">
                    {experience.map((exp, index) => (
                      <ExperienceEntry
                        key={index}
                        company={exp.company}
                        title={exp.title}
                        location={exp.location}
                        years={formatYears(exp.start_year, exp.end_year)}
                      />
                    ))}
                  </div>
                </div>
                <div className="section-title-container">
                  <p className="all-text section-title">Publications</p>
                </div>
              </div>

              <div className="one-box left-content-3 limiter">
                {/* <div className="skills-text-container">
                  <Skills skills={skills} />
                </div> */}
              </div>

              <div className="one-box right-content-4">
                <div className="publications-text-container">
                  <div className="publications-list">
                    {published.map(pub => (
                      <PublicationEntry key={pub.title} {...pub} />
                    ))}
                    {underReview.length > 0 && published.length > 0 && (
                      <div className="publications-divider">
                        <p className="publications-divider-label">Preprints &amp; Manuscripts Under Review</p>
                        <hr />
                      </div>
                    )}
                    {underReview.map(pub => (
                      <PublicationEntry key={pub.title} {...pub} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

    </>
  )
}

export default App
