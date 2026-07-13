import { Outlet, useParams } from 'react-router-dom';
import { FestivalNavbar } from '../components/FestivalNavbar';
import { TicketingProfileButton } from '../components/TicketingProfileButton';

export function CheckoutLayout() {
  const { eventId } = useParams();

  return (
    <>
      <div className="planStickyNav">
        <FestivalNavbar
          profileSlot={<TicketingProfileButton eventId={eventId} size="md" />}
        />
      </div>
      <div className="appShell">
        <Outlet />
      </div>
    </>
  );
}
