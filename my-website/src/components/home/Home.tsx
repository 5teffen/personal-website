import './Home.css'
// import Skills from './Skills'
import EducationEntry from './EducationEntry'
import ExperienceEntry from './ExperienceEntry'
import PublicationEntry from './PublicationEntry'
import aboutData from '../../data/about.json'
import publicationsData from '../../data/publications.json'
import backgroundImageAsset from './assets/image.png'

// Astro turns image imports into metadata objects, plain Vite into URL strings.
const backgroundImage: string =
  typeof backgroundImageAsset === 'string' ? backgroundImageAsset : (backgroundImageAsset as { src: string }).src

// interface Skill {
//   name: string
//   rating: number
// }

interface Education {
  school?: string
  company?: string
  degree: string
}

interface Publication {
  title: string
  authors: string[]
  venue: string
  year: number
  status?: string
  award?: string
  project?: string
}

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

// Rendered once at build time by Astro, so the data is read directly
// instead of through useState and useEffect, which never run on the server.
function Home() {
  const about: string = aboutData.about

  const education: Education[] = aboutData.education.map(edu => ({
    school: edu.school || edu.company,
    degree: edu.degree
  }))

  // All publications, sorted by year descending
  const publications: Publication[] = [
    ...publicationsData.first_author,
    ...publicationsData.collaboration
  ].sort((a, b) => b.year - a.year)

  // Only professional experience
  const experience: Experience[] = aboutData.experience.professional

  return (
    <>
      <div className="app-grid">
        <main className="main-content">
          <div className="content-box">
            <div className="inner-grid" style={{ backgroundImage: `url(${backgroundImage})` }}>
              <div className="one-box first-box name-panel">
                <p className="all-text first-name">Steffen</p>
                <p className="all-text last-name">HOLTER</p>
              </div>
              <div className="one-box first-box about-panel">
                 <p className="all-text section-title">About</p>
              </div>

              <div className="one-box left-content-1 limiter">
                <div className="links-container">
                  <div className="links-list">
              <a className="social-link" href="mailto:steffen.holter@inf.ethz.ch">
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
                        start={exp.start}
                        end={exp.end}
                        // start_year={exp.start_year}
                        // end_year={exp.end_year}
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
                    {publications.map((pub, index) => (
                      <PublicationEntry
                        key={index}
                        title={pub.title}
                        authors={pub.authors}
                        venue={pub.venue}
                        year={pub.year}
                        status={pub.status}
                        award={pub.award}
                        project={pub.project}
                      />
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

export default Home
