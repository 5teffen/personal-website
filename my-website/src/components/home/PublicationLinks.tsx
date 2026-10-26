import './PublicationLinks.css'

/**
 * Link types in visual order from left to right. The row is right-aligned, so
 * the last item sits nearest the title. Right to left that reads
 * PDF, Video, Code, Dataset, Project.
 */
export const LINK_TYPES = [
  { key: 'slides', label: 'Slides', icon: 'fas fa-window-maximize' },
  { key: 'project', label: 'Project', icon: 'fas fa-link' },
  { key: 'dataset', label: 'Dataset', icon: 'fas fa-database' },
  { key: 'code', label: 'Code', icon: 'fas fa-code' },
  { key: 'recording', label: 'Recording', icon: 'fas fa-video' },
  { key: 'demo', label: 'Demo', icon: 'fas fa-play' },
  { key: 'video', label: 'Video', icon: 'fas fa-film' },
  { key: 'preview', label: 'Preview', icon: 'fab fa-youtube' },
  { key: 'pdf', label: 'PDF', icon: 'fas fa-file-pdf' },
] as const

/**
 * A link counts as filled in only when it points somewhere: not empty, not "#" or
 * another in-page anchor, and not a TODO/TBD marker. Anything else is hidden.
 */
export function isFilledLink(href?: string): href is string {
  if (!href) return false
  const v = href.trim()
  if (v === '' || v.startsWith('#')) return false
  if (/^(todo|tbd|tba|n\/a|none|null)$/i.test(v)) return false
  return true
}

/**
 * Returns the video ID when a link points to a YouTube video, otherwise null.
 * Such links get a data-video-id so VideoLightbox can play them in an overlay.
 */
export function youtubeId(href: string): string | null {
  const m = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? m[1] : null
}

export type LinkKey = (typeof LINK_TYPES)[number]['key']
export type PublicationLinkMap = Partial<Record<LinkKey, string>>

/**
 * Project pages stay at their URLs, but the homepage icon is hidden for now.
 * Remove a key from this set to show that link again.
 */
const HIDDEN_LINK_KEYS = new Set<LinkKey>(['project'])

interface PublicationLinksProps {
  links?: PublicationLinkMap
  title: string
}

function PublicationLinks({ links, title }: PublicationLinksProps) {
  const present = LINK_TYPES.filter(t => !HIDDEN_LINK_KEYS.has(t.key) && isFilledLink(links?.[t.key]))
  if (present.length === 0) return null

  return (
    <ul className="pub-links" aria-label={`Links for ${title}`}>
      {present.map(t => {
        const href = links![t.key]!
        const external = /^https?:\/\//.test(href)
        const videoId = youtubeId(href)
        return (
          <li key={t.key}>
            <a
              className="pub-link"
              href={href}
              aria-label={t.label}
              {...(videoId ? { 'data-video-id': videoId, 'aria-haspopup': 'dialog' as const } : {})}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <i className={`${t.icon} pub-link-icon`} aria-hidden="true"></i>
              <span className="pub-link-label" aria-hidden="true">{t.label}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default PublicationLinks
