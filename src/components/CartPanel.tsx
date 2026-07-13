import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCartSelections, useCart, type CartItem } from '../lib/cartContext';
import { buildCheckoutFromCart } from '../lib/buildCheckoutFromCart';
import { persistCheckoutBasket } from '../lib/checkoutFlowStorage';
import { connectPath } from '../lib/routes';
import { formatPrice } from '../lib/theme';
import { AddToCartToast } from './AddToCartToast';
import './CartPanel.css';

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function formatSummaryPrice(price: number) {
  return formatPrice(price);
}

function toCartEntity(item: CartItem) {
  return {
    id: item.entityId,
    name: item.name,
    price: item.price,
    type: 'configurable_single' as const,
  };
}

type CartPanelProps = {
  mode: 'desktop' | 'mobile';
};

export function CartPanel({ mode }: CartPanelProps) {
  const navigate = useNavigate();
  const cartTitleId = useId();
  const { items, setQuantity, removeItem, totalItems, totalPrice } = useCart();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const cartBodyRef = useRef<HTMLDivElement | null>(null);
  const [cartHasOverflow, setCartHasOverflow] = useState(false);
  const [cartIsAtBottom, setCartIsAtBottom] = useState(true);

  const closeMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, []);

  const updateScrollHint = useCallback(() => {
    const el = cartBodyRef.current;
    if (!el) return;
    const overflow = el.scrollHeight - el.clientHeight > 4;
    setCartHasOverflow(overflow);
    if (!overflow) {
      setCartIsAtBottom(true);
      return;
    }
    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
    setCartIsAtBottom(remaining <= 4);
  }, []);

  useEffect(() => {
    if (mode !== 'mobile' || !isMobileDrawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobileDrawer();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeMobileDrawer, isMobileDrawerOpen, mode]);

  useEffect(() => {
    updateScrollHint();
  }, [items.length, mode, isMobileDrawerOpen, updateScrollHint]);

  useEffect(() => {
    const el = cartBodyRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => updateScrollHint());
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollHint]);

  const goToCheckout = () => {
    const returnHash = window.location.hash.replace(/^#/, '') || 'tickets';
    const payload = buildCheckoutFromCart(items, returnHash);
    if (!payload) return;
    persistCheckoutBasket(payload.eventId, payload);
    navigate(connectPath(payload.eventId), { state: payload });
  };

  if (items.length === 0) {
    return null;
  }

  const showScrollHint = useMemo(() => cartHasOverflow && !cartIsAtBottom, [cartHasOverflow, cartIsAtBottom]);

  const cartList = (
    <ul className="cartList">
      {items.map((item) => {
        const variantText = formatCartSelections(item.selections);

        return (
          <li key={item.key} className="ticketCard">
            <div className="ticketInfo">
              <div className="ticketInfoTop">
                <div className="ticketName">{item.name}</div>
                {variantText ? <p className="ticketVariants">{variantText}</p> : null}
              </div>
              <div className="ticketPriceBlock">
                <div className="ticketLineTotal">{formatSummaryPrice(item.price * item.quantity)}</div>
              </div>
            </div>
            <div className="ticketStub">
              <div className="cartQtyTheme cartQty" aria-label={`Quantity for ${item.name}`}>
                {item.quantity > 1 ? (
                  <button
                    type="button"
                    className="cartQtyBtnMinus"
                    aria-label={`Decrease quantity for ${item.name}`}
                    onClick={() =>
                      setQuantity(toCartEntity(item), item.quantity - 1, item.selections)
                    }
                  >
                    −
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ticketTrashBtn"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.entityId, item.selections)}
                  >
                    <TrashIcon />
                  </button>
                )}
                <span className="cartQtyValue">{item.quantity}</span>
                <button
                  type="button"
                  className="cartQtyBtnPlus"
                  aria-label={`Increase quantity for ${item.name}`}
                  onClick={() =>
                    setQuantity(
                      toCartEntity(item),
                      Math.min(99, item.quantity + 1),
                      item.selections,
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );

  const cartSummary = (
    <div className="cartSummary">
      <span className="cartSummaryItems">
        {totalItems} item{totalItems === 1 ? '' : 's'}
      </span>
      <span className="cartSummaryTotal">{formatSummaryPrice(totalPrice)}</span>
    </div>
  );

  const cartHeader = (showClose = false) => (
    <div className="cartHeader">
      <div className="cartHeaderTitleRow">
        <span className="cartHeaderIcon">
          <CartIcon />
        </span>
        <h2 className="cartTitle" id={showClose ? cartTitleId : undefined}>
          Your Cart
        </h2>
        {showClose ? (
          <button
            type="button"
            className="cartDrawerCloseBtn"
            aria-label="Close cart"
            onClick={closeMobileDrawer}
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );

  const checkoutButton = (
    <button type="button" className="cartCheckoutBtn" onClick={goToCheckout}>
      Go to checkout
    </button>
  );

  if (mode === 'desktop') {
    return (
      <aside className="planCartColumn" aria-label="Shopping cart">
        <div className="cartPanelReveal">
          <div className="cartPanel cartPanelFloat" role="complementary">
            {cartHeader()}
            <div
              ref={cartBodyRef}
              className={showScrollHint ? 'cartBody cartBodyHint' : 'cartBody'}
              aria-label="Cart items"
              onScroll={updateScrollHint}
            >
              {cartList}
              {showScrollHint ? (
                <div className="cartBodyMore" aria-hidden="true">
                  <span className="cartBodyMoreText">More tickets below</span>
                  <span className="cartBodyMoreArrow">⌄</span>
                </div>
              ) : null}
            </div>
            <div className="cartFooter" aria-label="Cart summary and checkout">
              {showScrollHint ? <div className="cartScrollHint">Scroll to see more tickets</div> : null}
              {cartSummary}
              <div className="cartCheckout">{checkoutButton}</div>
            </div>
          </div>
        </div>
        <AddToCartToast variant="desktop" />
      </aside>
    );
  }

  return (
    <>
      {!isMobileDrawerOpen ? (
        <div className="cartMobileBar" role="region" aria-label="Cart actions">
          <button
            type="button"
            className="cartMobileTrigger"
            aria-label={`View cart, ${totalItems} item${totalItems === 1 ? '' : 's'}, ${formatPrice(totalPrice)} total`}
            onClick={() => setIsMobileDrawerOpen(true)}
          >
            <span className="cartMobileTriggerIconWrap">
              <span className="cartMobileTriggerIcon" aria-hidden="true">
                <CartIcon />
              </span>
              <span className="cartMobileTriggerBadge" aria-hidden="true">
                {totalItems}
              </span>
            </span>
            <span className="cartMobileTriggerPrice">{formatPrice(totalPrice)}</span>
          </button>
          <button type="button" className="cartMobileCheckoutPill" onClick={goToCheckout}>
            Go to checkout
          </button>
        </div>
      ) : null}

      {isMobileDrawerOpen ? (
        <>
          <button
            type="button"
            className="cartMobileBackdrop"
            aria-label="Close cart"
            onClick={closeMobileDrawer}
          />
          <div
            className="cartMobileDrawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={cartTitleId}
          >
            <div className="cartMobileDrawerPanel cartPanel">
              {cartHeader(true)}
              <div className="cartMobileDrawerBody cartBody">
                <div
                  ref={cartBodyRef}
                  className={showScrollHint ? 'cartMobileDrawerScroll cartBodyHint' : 'cartMobileDrawerScroll'}
                  onScroll={updateScrollHint}
                >
                  {cartList}
                  {showScrollHint ? (
                    <div className="cartBodyMore" aria-hidden="true">
                      <span className="cartBodyMoreText">More tickets below</span>
                      <span className="cartBodyMoreArrow">⌄</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="cartFooter">
                {showScrollHint ? <div className="cartScrollHint">Scroll to see more tickets</div> : null}
                {cartSummary}
                <div className="cartCheckout">{checkoutButton}</div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
