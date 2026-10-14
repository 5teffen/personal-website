import './PublicationLinks.css'

/**
 * Link types and their fixed order. A publication lists only the links it has,
 * missing ones are omitted rather than shown greyed out.
 */
export const LINK_TYPES = [
  { key: 'project', label: 'Project', icon: 'fas fa-link' },
  { key: 'demo', label: 'Demo', icon: 'fas fa-play' },
  { key: 'pdf', label: 'PDF', icon: 'fas fa-file-pdf' },
  { key: 'video', label: 'Video', icon: 'fas fa-film' },
  { key: 'recording', label: 'Recording', icon: 'fas fa-video' },
  { key: 'code', label: 'Code', icon: 'fas fa-code' },
  { key: 'dataset', label: 'Dataset', icon: 'fas fa-database' },
  { key: 'slides', label: 'Slides', icon: 'fas fa-window-maximize' },
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

export type LinkKey = (typeof LINK_TYPES)[number]['key']
export type PublicationLinkMap = Partial<Record<LinkKey, string>>

interface PublicationLinksProps {
  links?: PublicationLinkMap
  title: string
}

function PublicationLinks({ links, title }: PublicationLinksProps) {
  const present = LINK_TYPES.filter(t => isFilledLink(links?.[t.key]))
  if (present.length === 0) return null

  return (
    <ul className="pub-links" aria-label={`Links for ${title}`}>
      {present.map(t => {
        const href = links![t.key]!
        const external = /^https?:\/\//.test(href)
        return (
          <li key={t.key}>
            <a
              className="pub-link"
              href={href}
              aria-label={t.label}
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
