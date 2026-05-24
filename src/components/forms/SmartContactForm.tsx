"use client";

import { useState, FormEvent, useMemo, useRef } from "react";
import {
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Heart,
  MessageCircle,
  Calendar,
  HandHeart,
} from "lucide-react";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { FormErrors } from "@/types";

type Topic = "general" | "visit" | "prayer" | "volunteer";

interface TopicMeta {
  id: Topic;
  label: string;
  icon: typeof MessageCircle;
  /** copy below the topic bar that briefly explains the form's purpose */
  blurb: string;
  /** submit button label */
  submitLabel: string;
  /** API type field */
  apiType: "contact" | "prayer";
}

const TOPICS: TopicMeta[] = [
  {
    id: "general",
    label: "General",
    icon: MessageCircle,
    blurb: "Have a question or something you'd like to share? Send us a message.",
    submitLabel: "Send Message",
    apiType: "contact",
  },
  {
    id: "visit",
    label: "Plan a Visit",
    icon: Calendar,
    blurb: "Let us know you're coming — we'll have someone ready to greet you.",
    submitLabel: "Send Visit Plan",
    apiType: "contact",
  },
  {
    id: "prayer",
    label: "Prayer Request",
    icon: Heart,
    blurb: "Our prayer team will lift you up in prayer. You are not alone.",
    submitLabel: "Submit Prayer Request",
    apiType: "prayer",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    icon: HandHeart,
    blurb: "Tell us where you'd like to serve. We'll connect you with the ministry leader.",
    submitLabel: "Send Interest",
    apiType: "contact",
  },
];

const VISIT_WHEN_OPTIONS = [
  { value: "next-sabbath", label: "Next Sabbath" },
  { value: "two-weeks", label: "Within 2 weeks" },
  { value: "month", label: "Within a month" },
  { value: "specific", label: "I have a specific date" },
];

const MINISTRY_OPTIONS = [
  { value: "youth", label: "Youth Ministry" },
  { value: "women", label: "Women's Ministry" },
  { value: "men", label: "Men's Ministry" },
  { value: "music", label: "Music Ministry" },
  { value: "community", label: "Community Outreach" },
  { value: "tech", label: "Tech / Livestream" },
  { value: "not-sure", label: "Not sure — please advise" },
];

function validateEmail(email: string): boolean {
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
}

interface SmartContactFormProps {
  initialTopic?: Topic;
  className?: string;
}

export function SmartContactForm({
  initialTopic = "general",
  className,
}: SmartContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [visitWhen, setVisitWhen] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [ministry, setMinistry] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const meta = useMemo(() => TOPICS.find((t) => t.id === topic)!, [topic]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    const isPrayerAnon = topic === "prayer" && anonymous;

    if (!isPrayerAnon) {
      if (!name.trim()) e.name = "Name is required";
      else if (name.length > 100) e.name = "Name must be 100 characters or less";
      if (!email.trim()) e.email = "Email is required";
      else if (!validateEmail(email)) e.email = "Please enter a valid email address";
    }

    if (!message.trim())
      e.message = topic === "prayer" ? "Prayer request is required" : "Message is required";
    else if (message.length > 2000)
      e.message = "Must be 2000 characters or less";

    if (topic === "visit") {
      if (!visitWhen) e.visitWhen = "Please choose a time frame";
      if (visitWhen === "specific" && !visitDate) e.visitDate = "Please pick a date";
    }
    if (topic === "volunteer") {
      if (!ministry) e.ministry = "Please pick an area of interest";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => {
    if (topic === "prayer") {
      return {
        type: "prayer" as const,
        data: {
          name: anonymous ? "Anonymous" : name,
          email: anonymous ? "" : email,
          request: message,
          isPublic: false,
        },
      };
    }

    let prefix = "";
    if (topic === "visit") {
      const whenLabel =
        VISIT_WHEN_OPTIONS.find((o) => o.value === visitWhen)?.label ?? visitWhen;
      prefix = `[Planning a visit — ${whenLabel}${visitDate ? ` (${visitDate})` : ""}]\n\n`;
    } else if (topic === "volunteer") {
      const m = MINISTRY_OPTIONS.find((o) => o.value === ministry)?.label ?? ministry;
      prefix = `[Volunteer interest — ${m}]\n\n`;
    }

    return {
      type: "contact" as const,
      data: {
        name,
        email,
        message: `${prefix}${message}`,
      },
    };
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
      const payload = buildPayload();
      let dbRes: Response;
      if (topic === "prayer") {
        dbRes = await fetch("/api/prayers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: anonymous ? "Anonymous" : name,
            email: anonymous ? "" : email,
            request: message,
            isPublic: false,
          }),
        });
      } else {
        dbRes = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            message: (payload.data as { message: string }).message,
          }),
        });
      }
      if (!dbRes.ok) throw new Error("Failed to send message");
      fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(console.error);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setVisitWhen("");
      setVisitDate("");
      setMinistry("");
      setAnonymous(false);
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
      if (retryCount < 2) setRetryCount((c) => c + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    doSubmit();
  };

  const switchTopic = (next: Topic) => {
    setTopic(next);
    setErrors({});
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <div
        className={cn(
          "bg-[var(--surface)] dark:bg-stone-800 p-8 rounded-2xl shadow-lg border border-[var(--border-subtle)] dark:border-stone-700",
          className,
        )}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 font-[family-name:var(--font-playfair)]">
            {topic === "prayer" ? "Prayer Request Submitted" : "Message Sent!"}
          </h3>
          <p className="text-stone-600 dark:text-stone-400">
            {topic === "prayer"
              ? "Our prayer team will lift you up in prayer. You are not alone."
              : "Thank you — we'll be in touch soon."}
          </p>
          <Button variant="outline" onClick={() => setSuccess(false)}>
            Send Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-[var(--surface)] dark:bg-stone-800 rounded-2xl shadow-lg border border-[var(--border-subtle)] dark:border-stone-700 overflow-hidden",
        className,
      )}
    >
      {/* Topic chip bar */}
      <div
        role="tablist"
        aria-label="Contact topic"
        className="flex gap-2 p-2 overflow-x-auto scrollbar-hide border-b border-[var(--border-subtle)] dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40"
      >
        {TOPICS.map((t) => {
          const Icon = t.icon;
          const active = t.id === topic;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => switchTopic(t.id)}
              className={cn(
                "flex-shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all",
                active
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[rgba(234,179,8,0.25)]"
                  : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-[var(--primary)]/10 border border-[var(--border-subtle)] dark:border-stone-700",
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-1 font-[family-name:var(--font-playfair)]">
          {meta.label}
        </h3>
        <p className="text-stone-600 dark:text-stone-400 mb-6">{meta.blurb}</p>

        {error && (
          <div
            className="mb-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-rose-800 dark:text-rose-200">{error}</p>
                {retryCount > 0 && (
                  <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">
                    Attempt {retryCount} of 3
                  </p>
                )}
                {retryCount < 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={doSubmit}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
          {topic === "prayer" && (
            <Checkbox
              label="Submit anonymously"
              helperText="Skip name and email. Your request will be shared with our prayer team only."
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
          )}

          {!(topic === "prayer" && anonymous) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                required
                maxLength={100}
              />
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
                inputMode="email"
              />
            </div>
          )}

          {topic === "visit" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select
                label="When would you like to visit?"
                value={visitWhen}
                onChange={(e) => setVisitWhen(e.target.value)}
                options={VISIT_WHEN_OPTIONS}
                placeholder="Pick a time frame"
                error={errors.visitWhen}
                required
              />
              {visitWhen === "specific" && (
                <Input
                  label="Date"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  error={errors.visitDate}
                  required
                />
              )}
            </div>
          )}

          {topic === "volunteer" && (
            <Select
              label="Where would you like to serve?"
              value={ministry}
              onChange={(e) => setMinistry(e.target.value)}
              options={MINISTRY_OPTIONS}
              placeholder="Pick an area of interest"
              error={errors.ministry}
              required
            />
          )}

          <Textarea
            label={
              topic === "prayer"
                ? "Prayer Request"
                : topic === "visit"
                ? "Anything we should know?"
                : topic === "volunteer"
                ? "Tell us about yourself"
                : "Message"
            }
            placeholder={
              topic === "prayer"
                ? "Share what you'd like us to pray for…"
                : topic === "visit"
                ? "Number of guests, accessibility needs, questions…"
                : topic === "volunteer"
                ? "Your experience, availability, or questions…"
                : "How can we help you?"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={errors.message}
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
            rightIcon={
              submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : topic === "prayer" ? (
                <Heart className="w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )
            }
          >
            {submitting ? "Sending..." : meta.submitLabel}
          </Button>
        </form>
      </div>
    </div>
  );
}
