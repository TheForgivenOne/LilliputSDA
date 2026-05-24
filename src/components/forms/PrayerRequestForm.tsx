"use client";

import { useState, FormEvent, useRef } from "react";
import { Heart, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Input, Textarea, Checkbox } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { FormErrors } from "@/types";

interface PrayerRequestFormProps {
  onSuccess?: () => void;
  className?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

export default function PrayerRequestForm({ onSuccess, className }: PrayerRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    request: "",
    isPublic: false,
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

    if (!form.request.trim()) {
      newErrors.request = "Prayer request is required";
    } else if (form.request.length > 2000) {
      newErrors.request = "Request must be 2000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const doSubmit = async () => {
    setError(null);

    if (!validate()) {
      requestAnimationFrame(() => {
        (formRef.current?.querySelector('[aria-invalid="true"]') as HTMLElement)?.focus();
      });
      return;
    }

    setSubmitting(true);

    try {
      const dbRes = await fetch("/api/prayers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, request: form.request, isPublic: form.isPublic }),
      });

      if (!dbRes.ok) throw new Error("Failed to submit prayer request");

      fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "prayer",
          data: { name: form.name, email: form.email, request: form.request, isPublic: form.isPublic },
        }),
      }).catch(console.error);

      setSuccess(true);
      setForm({ name: "", email: "", request: "", isPublic: false });
      formRef.current?.reset();

      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit prayer request. Please try again.";
      setError(errorMessage);

      if (retryCount < 2) {
        setRetryCount((prev) => prev + 1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    doSubmit();
  };

  if (success) {
    return (
      <div className={`bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-lg ${className || ""}`}>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Heart className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Prayer Request Submitted
          </h3>
          <p className="text-stone-600 dark:text-stone-400">
            Our prayer team will lift you up in prayer. You are not alone.
          </p>
          <Button
            variant="outline"
            onClick={() => setSuccess(false)}
            className="mt-4"
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-lg ${className || ""}`}>
      <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
        Prayer Request
      </h3>
      <p className="text-stone-600 dark:text-stone-400 mb-6">
        We would be honored to pray for you. Submit your prayer request below, and our prayer team will lift you up.
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
                  onClick={doSubmit}
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
          aria-describedby={errors.name ? "prayer-name-error" : undefined}
          required
          maxLength={100}
        />

        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          aria-describedby={errors.email ? "prayer-email-error" : undefined}
          required
          inputMode="email"
        />

        <Textarea
          label="Prayer Request"
          placeholder="Share what you'd like us to pray for..."
          value={form.request}
          onChange={(e) => setForm({ ...form, request: e.target.value })}
          error={errors.request}
          aria-describedby={errors.request ? "prayer-request-error" : undefined}
          required
          rows={5}
          maxLength={2000}
          showCount
        />

        <Checkbox
          label="Share anonymously on prayer list"
          helperText="If checked, your request will be shared (without your name) on our prayer list for others to pray alongside you."
          checked={form.isPublic}
          onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={submitting}
          rightIcon={submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
        >
          {submitting ? "Submitting..." : "Submit Prayer Request"}
        </Button>
      </form>
    </div>
  );
}
