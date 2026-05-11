"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import Button from "@/components/ui/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const variantStyles = {
    danger: {
      icon: "text-rose-500",
      button: "bg-[var(--accent-wine)] hover:bg-[#561F30] focus:ring-[var(--accent-wine)]",
    },
    warning: {
      icon: "text-[var(--primary)]",
      button: "bg-[var(--primary)] hover:bg-[var(--primary-hover)] focus:ring-[var(--primary)]",
    },
    info: {
      icon: "text-[var(--accent-cool)]",
      button: "bg-[var(--accent-cool)] hover:bg-[#524F6B] focus:ring-[var(--accent-cool)]",
    },
  };

  const style = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center">
        <div
          className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${style.icon} bg-current/10`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
          {title}
        </h3>
        <p className="text-stone-600 dark:text-stone-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            className={style.button}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
