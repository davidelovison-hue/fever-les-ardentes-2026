import { useToast } from '../lib/toastContext';
import './AddToCartToast.css';

type AddToCartToastProps = {
  variant: 'mobile' | 'desktop';
};

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function AddToCartToast({ variant }: AddToCartToastProps) {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className={variant === 'desktop' ? 'toastHost toastHostDesktop' : 'toastHost toastHostMobile'}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={toast.exiting ? 'addToCartToast addToCartToastExiting' : 'addToCartToast'}
          role="status"
        >
          <span className="addToCartToastAccent" aria-hidden="true" />
          <div className="addToCartToastBody">
            <span className="addToCartToastIcon">
              <BellIcon />
            </span>
            <p className="addToCartToastMessage">{toast.message}</p>
            <button
              type="button"
              className="addToCartToastClose"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
