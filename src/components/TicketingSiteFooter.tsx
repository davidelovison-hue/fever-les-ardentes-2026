import './TicketingSiteFooter.css'

export type TicketingFooterLink = {
  label: string
  href: string
  external?: boolean
}

type TicketingSiteFooterColumn = {
  title: string
  links: TicketingFooterLink[]
}

type TicketingSiteFooterProps = {
  columns: TicketingSiteFooterColumn[]
}

export function TicketingSiteFooter({ columns }: TicketingSiteFooterProps) {
  return (
    <footer className="ticketingSiteFooter" aria-label="Site">
      <div className="ticketingSiteFooter__pattern" aria-hidden />
      <div className="ticketingSiteFooter__inner">
        <div className="ticketingSiteFooter__grid">
          {columns.map((col) => (
            <section key={col.title} className="ticketingSiteFooter__col">
              <h2 className="ticketingSiteFooter__title">{col.title}</h2>
              <ul className="ticketingSiteFooter__list">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      className="ticketingSiteFooter__link"
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </footer>
  )
}
