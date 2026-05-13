"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useRef, useCallback, useEffect, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  maxLength?: number;
  inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
  debounceMs?: number;
  onDebounce?: (value: string) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      maxLength,
      inputMode,
      debounceMs,
      onDebounce,
      className,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      if (debounceMs && onDebounce) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          onDebounce(value);
        }, debounceMs);
      }
      
      if (onChange) {
        onChange(e);
      }
    }, [debounceMs, onDebounce, onChange]);

    useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate max-w-full"
            title={label}
          >
            {label}
            {props.required && (
              <span className="text-rose-500 ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            maxLength={maxLength}
            inputMode={inputMode}
            onChange={handleChange}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              "px-4 py-3 bg-white dark:bg-stone-800 border rounded-lg transition-all duration-200 min-w-0",
              "placeholder:text-stone-400 dark:placeholder:text-stone-500",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error
                ? "border-rose-300 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                : "border-stone-300 dark:border-stone-600",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              fullWidth && "w-full",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-rose-600 dark:text-rose-400" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-sm text-stone-500 dark:text-stone-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

// Textarea Component
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  debounceMs?: number;
  onDebounce?: (value: string) => void;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, fullWidth = true, rows = 4, maxLength, showCount, debounceMs, onDebounce, className, id, value, onChange, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const charCount = typeof value === 'string' ? value.length : 0;
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      
      if (debounceMs && onDebounce) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          onDebounce(newValue);
        }, debounceMs);
      }
      
      if (onChange) {
        onChange(e);
      }
    }, [debounceMs, onDebounce, onChange]);

    useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate max-w-full"
            title={label}
          >
            {label}
            {props.required && (
              <span className="text-rose-500 ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : showCount ? `${inputId}-count` : undefined}
          className={cn(
            "px-4 py-3 bg-white dark:bg-stone-800 border rounded-lg transition-all duration-200 resize-y min-h-[100px] min-w-0",
            "placeholder:text-stone-400 dark:placeholder:text-stone-500",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-rose-300 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
              : "border-stone-300 dark:border-stone-600",
            fullWidth && "w-full",
            className
          )}
          {...props}
        />
        <div className="flex justify-between">
          {error ? (
            <p id={`${inputId}-error`} className="text-sm text-rose-600 dark:text-rose-400" role="alert">
              {error}
            </p>
          ) : helperText ? (
            <p id={`${inputId}-helper`} className="text-sm text-stone-500 dark:text-stone-400">
              {helperText}
            </p>
          ) : <span />}
          {showCount && maxLength && (
            <p id={`${inputId}-count`} className={cn(
              "text-xs",
              charCount >= maxLength ? "text-rose-500" : "text-stone-400 dark:text-stone-500"
            )}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// Select Component
interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, options, fullWidth = true, placeholder, className, id, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            {label}
            {props.required && (
              <span className="text-rose-500 ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              "px-4 py-3 bg-white dark:bg-stone-800 border rounded-lg transition-all duration-200 appearance-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 focus-visible:border-[var(--primary)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error
                ? "border-rose-300 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                : "border-stone-300 dark:border-stone-600",
              fullWidth && "w-full",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 dark:text-stone-500" aria-hidden="true">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-rose-600 dark:text-rose-400" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-sm text-stone-500 dark:text-stone-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

// Checkbox Component
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            className={cn(
              "w-5 h-5 rounded border-stone-300 dark:border-stone-600",
              "text-amber-700 focus-visible:ring-[var(--primary)] focus-visible:ring-2",
              "dark:bg-stone-800 dark:checked:bg-amber-700"
            )}
            {...props}
          />
        </div>
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              {label}
            </label>
          )}
          {helperText && (
            <p id={`${inputId}-helper`} className="text-sm text-stone-500 dark:text-stone-400">
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Input, Textarea, Select, Checkbox };
