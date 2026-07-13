import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FESTIVAL_EVENT_ID, FESTIVAL_LOGO_SRC } from '../lib/festivalEvent';
import { TicketingProfileButton } from './TicketingProfileButton';
import './FestivalNavbar.css';

type FestivalNavbarProps = {
  profileSlot?: ReactNode;
};

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function FestivalNavbar({ profileSlot }: FestivalNavbarProps) {
  const navigate = useNavigate();
  const profileControl =
    profileSlot ?? (
      <TicketingProfileButton eventId={FESTIVAL_EVENT_ID} size="md" className="festivalNavbarProfileSlot" />
    );

  return (
    <header className="festivalNavbar">
      <div className="festivalNavbarInner">
        <div className="leftCluster">
          <button
            type="button"
            className="logo logoButton"
            aria-label="Les Ardentes — overview"
            onClick={() => navigate('/#overview')}
          >
            <img
              className="logoImg"
              src={FESTIVAL_LOGO_SRC}
              alt="Les Ardentes"
              width={160}
              height={58}
              decoding="async"
            />
          </button>
        </div>

        <div className="actionsDesktop">
          <button type="button" className="iconBtn" aria-label="Language">
            <span className="globe">
              <GlobeIcon />
            </span>
            EN
          </button>
          <span className="vRuleActions" aria-hidden="true" />
          <span className="festivalNavbarProfileSlot">{profileControl}</span>
        </div>

        <div className="actionsMobile" role="toolbar" aria-label="Quick actions">
          <span className="festivalNavbarProfileSlot">{profileControl}</span>
          <button type="button" className="iconBtnMobile" aria-label="Open menu">
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
