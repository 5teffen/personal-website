import './PublicationEntry.css'

interface PublicationEntryProps {
  title: string
  authors: string[]
  venue: string
  year: number
  status?: string
  award?: string
}

function PublicationEntry({ 
  title, 
  authors, 
  venue, 
  year, 
  status,
  award 
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

