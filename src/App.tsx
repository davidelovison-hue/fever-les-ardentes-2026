import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';import { CartAddToastBridge } from './components/CartAddToastBridge';
import { CartProvider } from './lib/cartContext';
import { ToastProvider } from './lib/toastContext';
import { CheckoutLayout } from './layouts/CheckoutLayout';
import { PlanPage } from './pages/PlanPage';
import { ConnectPage } from './pages/ConnectPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { GuestCheckoutPage } from './pages/GuestCheckoutPage';
import { PostBookingPage } from './pages/PostBookingPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AccountPage } from './pages/AccountPage';
import './checkoutTheme.css';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ToastProvider>
        <CartProvider>
          <CartAddToastBridge />
          <Routes>
            <Route path="/" element={<PlanPage />} />
            <Route element={<CheckoutLayout />}>
              <Route path="/event/:eventId/connect" element={<ConnectPage />} />
              <Route path="/event/:eventId/guest-checkout" element={<GuestCheckoutPage />} />
              <Route path="/event/:eventId/checkout" element={<CheckoutPage />} />
              <Route path="/event/:eventId/post-booking" element={<PostBookingPage />} />
              <Route path="/event/:eventId/confirmation" element={<OrderConfirmationPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}