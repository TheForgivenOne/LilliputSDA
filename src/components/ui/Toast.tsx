"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  success: (message: string, options?: Partial<Omit<Toast, "id" | "variant" | "message">>) => string;
  error: (message: string, options?: Partial<Omit<Toast, "id" | "variant" | "message">>) => string;
  warning: (message: string, options?: Partial<Omit<Toast, "id" | "variant" | "message">>) => string;
  info: (message: string, options?: Partial<Omit<Toast, "id" | "variant" | "message">>) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  defaultDuration?: number;
}

function ToastProvider({ children, defaultDuration = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string, options?: Partial<Omit<Toast, "id" | "variant" | "message">>) => {
      return addToast({ message, variant: "success", ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: Partial<Omit<Toast, "id" | "variant" | "message">>) => {
      return addToast({ message, variant: "error", duration: 7000, ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<Omit<Toast, "id" | "variant" | "message">>) => {
      return addToast({ message, variant: "warning", ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: Partial<Omit<Toast, "id" | "variant" | "message">>) => {
      return addToast({ message, variant: "info", ...options });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      {mounted && createPortal(<ToastContainer toasts={toasts} onRemove={removeToast} defaultDuration={defaultDuration} />, document.body)}
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  defaultDuration: number;
}

function ToastContainer({ toasts, onRemove, defaultDuration }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} defaultDuration={defaultDuration} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  defaultDuration: number;
}

function ToastItem({ toast, onRemove, defaultDuration }: ToastItemProps) {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);
  const duration = toast.duration ?? defaultDuration;

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    if (duration === 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        handleRemove();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const variantStyles: Record<ToastVariant, { icon: typeof CheckCircle; bg: string; iconColor: string; progressColor: string }> = {
    success: {
      icon: CheckCircle,
      bg: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-500",
      progressColor: "bg-green-500",
    },
    error: {
      icon: AlertCircle,
      bg: "bg-rose-50 dark:bg-rose-900/20",
      iconColor: "text-rose-500",
      progressColor: "bg-rose-500",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-500",
      progressColor: "bg-amber-500",
    },
    info: {
      icon: Info,
      bg: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-500",
      progressColor: "bg-orange-500",
    },
  };

  const style = variantStyles[toast.variant];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "relative pointer-events-auto overflow-hidden rounded-lg shadow-xl ring-1 ring-black/5 dark:ring-white/10",
        "transition-all duration-300 ease-out",
        style.bg,
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", style.iconColor)} />
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {toast.title}
            </p>
          )}
          <p className={cn("text-sm text-stone-600 dark:text-stone-300", toast.title && "mt-1")}>
            {toast.message}
          </p>
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4 text-stone-400" />
        </button>
      </div>
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-100 dark:bg-stone-700">
          <div
            className={cn("h-full transition-all duration-100 ease-linear", style.progressColor)}
            style={{ width: `${progress}%` }}
          />
        </div>
        )}
    </div>
  );
}

export { ToastProvider, useToast };

