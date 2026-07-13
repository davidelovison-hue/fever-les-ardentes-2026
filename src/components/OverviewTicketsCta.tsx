import './OverviewTicketsCta.css';

type OverviewTicketsCtaProps = {
  mode: 'desktop' | 'mobile';
  onGoToTickets: () => void;
};

export function OverviewTicketsCta({ mode, onGoToTickets }: OverviewTicketsCtaProps) {
  if (mode === 'desktop') {
    return (
      <aside className="planCartColumn" aria-label="Get tickets">
        <div className="cartPanelReveal">
          <div className="overviewCtaPanel" role="complementary">
            <button type="button" className="overviewCtaBtn" onClick={onGoToTickets}>
              Go to Festival Tickets
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div className="overviewMobileCtaBar" role="region" aria-label="Get tickets">
      <button type="button" className="overviewMobileCtaBtn" onClick={onGoToTickets}>
        Go to Festival Tickets
      </button>
    </div>
  );
}
