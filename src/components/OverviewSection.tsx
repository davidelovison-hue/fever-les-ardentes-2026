import { OVERVIEW_INFO } from '../data/lesArdentesFestival';
import { LES_ARDENTES_ARTISTS } from '../data/lesArdentesArtists';
import { FestivalArtistsCarousel } from './FestivalArtistsCarousel';
import './OverviewSection.css';

function HelpIcon() {
  return (
    <svg className="headingIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 14v3a2 2 0 0 0 2 2h1M20 14v3a2 2 0 0 1-2 2h-1M4 14a8 8 0 0 1 16 0M9 18v2M15 18v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M8 14h.01M16 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function VenueIcon() {
  return (
    <svg className="headingIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 11h.01M12 11h.01M15 11h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="headingIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}

export function OverviewSection() {
  return (
    <div className="overview">
      <div className="narrow">
        <p className="intro">
          Les Ardentes is one of Europe&apos;s leading urban, hip-hop, and rap festivals — four days of
          international headliners and rising stars in the heart of Liège. Expect multiple stages,
          immersive production, and the energy that draws tens of thousands of fans from across Europe.{' '}
          <strong className="introBold">
            Get your tickets now for the 2026 edition!
          </strong>
        </p>

        <section className="block" aria-labelledby="overview-general">
          <h2 id="overview-general" className="heading">
            General Info
          </h2>
          <ul className="infoList">
            {OVERVIEW_INFO.map((item) => (
              <li key={item.label} className="infoListItem">
                <span className="infoIcon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>
                  <strong className="infoLabel">{item.label}:</strong> {item.text}
                </span>
              </li>
            ))}
            <li className="infoListItem">
              <span className="infoIcon" aria-hidden="true">
                👤
              </span>
              <span>
                <strong className="infoLabel">Minors:</strong> Under 16 must be accompanied by an adult
                for camping and festival access. Ages 16–18 require signed parental authorization.
              </span>
            </li>
          </ul>
        </section>
      </div>

      <div className="narrow">
        <section className="block" aria-labelledby="overview-description">
          <h2 id="overview-description" className="heading">
            Description
          </h2>
          <p className="bodyText">
            Les Ardentes transforms Parc Rocourt into a massive music village with dedicated areas and
            spectacular productions. Browse tickets, camping, parking, and merch in the tabs above. Tickets
            are personalized with a dynamic QR code before the event. By continuing, you agree to our{' '}
            <a href="https://feverup.com" className="link" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </p>
        </section>

        <FestivalArtistsCarousel
          artists={LES_ARDENTES_ARTISTS}
          title="Lineup"
          hint="Swipe for more"
          hideDay
          className="overviewArtistsCarousel"
        />

        <section className="block" aria-labelledby="overview-help">
          <h2 id="overview-help" className="headingWithIcon">
            <HelpIcon />
            Need help?
          </h2>
          <p className="bodyText">
            Visit the official FAQ at{' '}
            <a href="https://tickets.lesardentes.be" className="link" target="_blank" rel="noopener noreferrer">
              tickets.lesardentes.be
            </a>{' '}
            or contact support via your client area.
          </p>
        </section>

        <section className="block" aria-labelledby="overview-venue">
          <h2 id="overview-venue" className="headingWithIcon">
            <VenueIcon />
            About the venue
          </h2>
          <div className="venueGrid venueGrid--textOnly">
            <div className="venueText">
              <h3 className="subheading">Parc Rocourt</h3>
              <p className="bodyText">
                The festival takes place at Parc Rocourt in Liège — open parkland transformed for four days
                into a multi-stage festival site with camping zones nearby. Well connected by road and
                public transport from Liège city centre.
              </p>
              <a
                href="https://www.lesardentes.be"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </a>
            </div>
          </div>
        </section>

        <section className="block" aria-labelledby="overview-getting">
          <h2 id="overview-getting" className="headingWithIcon">
            <LocationIcon />
            Getting there
          </h2>
          <div className="gettingGrid">
            <div className="gettingAddress">
              <h3 className="subheading">Parc Rocourt</h3>
              <p className="addressLines">
                {`Rue de l'Arbre Courte-Joie\n4000 Liège\nBelgium`}
              </p>
            </div>
            <div className="mapWrap">
              <iframe
                title="Venue location map"
                className="mapIframe"
                src="https://maps.google.com/maps?q=Parc+Rocourt+Li%C3%A8ge+Belgium&z=14&output=embed&hl=en"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
