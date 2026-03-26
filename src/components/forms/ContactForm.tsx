"use client";

import { useState, FormEvent, useRef } from "react";
import { Send, Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { FormErrors } from "@/types";

interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

export default function ContactForm({ onSuccess, className }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.length > 100) {
      newErrors.name = "Name must be 100 characters or less";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.length > 2000) {
      newErrors.message = "Message must be 2000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
      formRef.current?.reset();

      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message. Please try again.";
      setError(errorMessage);

      if (retryCount < 2) {
        setRetryCount((prev) => prev + 1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={`bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-lg ${className || ""}`}>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Message Sent!
          </h3>
          <p className="text-stone-600 dark:text-stone-400">
            Have a question or want to learn more? We&apos;d love to hear from you.
          </p>
          <Button
            variant="outline"
            onClick={() => setSuccess(false)}
            className="mt-4"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-lg ${className || ""}`}>
      <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
        Send Us a Message
      </h3>
      <p className="text-stone-600 dark:text-stone-400 mb-6">
        Have a question or want to learn more? We would love to hear from you.
      </p>

      {error && (
        <div
          className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
              {retryCount > 0 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Attempt {retryCount} of 3
                </p>
              )}
              {retryCount < 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSubmit}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  className="mt-2 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Input
          label="Name"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          required
          maxLength={100}
        />

        <Input
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          required
          inputMode="email"
        />

        <Textarea
          label="Message"
          placeholder="How can we help you?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          error={errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          required
          rows={5}
          maxLength={2000}
          showCount
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={submitting}
          rightIcon={submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        >
          {submitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
