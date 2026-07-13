import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type ToastItem = {
  id: string;
  message: string;
  exiting?: boolean;
};

type ToastContextValue = {
  toasts: ToastItem[];
  showToast: (message: string) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
    );

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 320);
  }, []);

  const showToast = useCallback(
    (message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setToasts((current) => [...current, { id, message }]);

      const existingTimer = timersRef.current.get(id);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = window.setTimeout(() => {
        dismissToast(id);
        timersRef.current.delete(id);
      }, TOAST_DURATION_MS);

      timersRef.current.set(id, timer);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
