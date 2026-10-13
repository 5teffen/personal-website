import { Fragment, useState } from 'react'
import './Announcement.css'

interface AnnouncementProps {
  label: string
  lead: string
  topics: string[]
}

/**
 * A small dismissible announcement above About: a light outlined box with a small title and the message. Closing it is
 * remembered per visitor, keyed by the full text, so a new message shows again.
 */
const storageKey = (text: string) => `announcement-dismissed:${text}`

function readDismissed(text: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(storageKey(text)) === '1'
  } catch {
    return false
  }
}

/** "a", "a and b", "a, b and c" with each topic underlined */
function TopicList({ topics }: { topics: string[] }) {
  return (
    <>
      {topics.map((t, i) => (
        <Fragment key={t}>
          {i > 0 && (i === topics.length - 1 ? ' and ' : ', ')}
          <span className="announcement-topic">{t}</span>
        </Fragment>
      ))}
    </>
  )
}

function Announcement({ label, lead, topics }: AnnouncementProps) {
  const text = `${label} ${lead} ${topics.join(', ')}`
  const [visible, setVisible] = useState(() => !readDismissed(text))

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(storageKey(text), '1')
    } catch {
      /* storage unavailable (private mode): it just closes for this visit */
    }
  }

  return (
    <aside className="announcement" aria-label={label}>
      <p className="announcement-title">{label}</p>
      <p className="announcement-text">
        {lead} <TopicList topics={topics} />.
      </p>
      <button type="button" className="announcement-close" onClick={dismiss} aria-label="Dismiss announcement">
        <i className="fas fa-times" aria-hidden="true"></i>
      </button>
    </aside>
  )
}

export default Announcement
