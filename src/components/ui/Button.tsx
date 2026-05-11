"use client";

import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "wine" | "gold";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      loadingText,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group";

    // Vesper variants — indigo (primary), brass (gold), mulberry (wine), slate (secondary).
    // Built on semantic tokens from globals.css / tokens.css.
    const variants = {
      primary:
        "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] focus:ring-[var(--primary)] shadow-lg shadow-[rgba(59,58,143,0.30)] hover:shadow-[rgba(59,58,143,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
      gold:
        "bg-[var(--accent-warm)] text-[#1B1A2E] hover:bg-[#B68D40] focus:ring-[var(--accent-warm)] shadow-lg shadow-[rgba(200,162,74,0.28)] hover:shadow-[rgba(200,162,74,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
      wine:
        "bg-[var(--accent-wine)] text-white hover:bg-[#561F30] focus:ring-[var(--accent-wine)] shadow-lg shadow-[rgba(110,42,62,0.30)] hover:shadow-[rgba(110,42,62,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
      secondary:
        "bg-stone-800 text-white hover:bg-stone-900 focus:ring-stone-500 shadow-lg shadow-stone-900/25 hover:shadow-stone-900/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
      outline:
        "border-2 border-[var(--primary)] text-[var(--primary)] dark:text-[var(--accent-lilac)] hover:bg-[var(--primary)] hover:text-white focus:ring-[var(--primary)] hover:-translate-y-0.5 active:translate-y-0",
      ghost:
        "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 focus:ring-stone-500",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-lg shadow-rose-900/30 hover:shadow-rose-900/45 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
    };

    const sizes = {
      sm: "px-4 py-2.5 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{loadingText || "Loading..."}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0 transition-transform group-hover:-translate-x-0.5">{leftIcon}</span>}
            <span className="relative">{children}</span>
            {rightIcon && <span className="flex-shrink-0 transition-transform group-hover:translate-x-0.5">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
