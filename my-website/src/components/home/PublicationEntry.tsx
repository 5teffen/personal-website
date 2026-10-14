import './PublicationEntry.css'
import PublicationLinks from './PublicationLinks'
import type { PublicationLinkMap } from './PublicationLinks'

interface PublicationEntryProps {
  title: string
  authors: string[]
  venue: string
  year: number
  status?: string
  award?: string
  links?: PublicationLinkMap
}

function PublicationEntry({ 
  title, 
  authors, 
  venue, 
  year, 
  status,
  award,
  links
}: PublicationEntryProps) {
  const formatAuthors = (authors: string[]) => {
    return (
      <>
        {authors.map((author, index) => {
          const isBold = author.replace('*', '').trim().includes('Steffen Holter')
          return (
            <span key={index}>
              {isBold ? <strong>{author}</strong> : author}
              {index < authors.length - 1 && ', '}
            </span>
          )
        })}
      </>
    )
  }

  return (
    <div className="publication-entry">
      <PublicationLinks links={links} title={title} />
      <div className="publication-title">{title}</div>
      <div className="publication-authors">
        {formatAuthors(authors)}
      </div>
      <div className="publication-venue">
        {venue}. {year}. {status && `[${status}]`}
        {award && (
          <span className="award-icon" title={award}>
            🏆
          </span>
        )}
      </div>
    </div>
  )
}

export default PublicationEntry

