"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Cross,
  BookOpen,
  Phone,
  MessageCircle,
  Sparkles,
  MapPin,
  Globe,
  Mail,
  HandHeart,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { VesperLight } from "@/components/motion/VesperLight";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  decision: string;
  isAdventist: string;
  phone: string;
  ageGroup: string;
  address: string;
  parish: string;
  country: string;
  email: string;
  prayerRequest: string;
  comments: string;
  source: string;
}

const EMPTY: FormData = {
  name: "",
  decision: "",
  isAdventist: "",
  phone: "",
  ageGroup: "",
  address: "",
  parish: "",
  country: "",
  email: "",
  prayerRequest: "",
  comments: "",
  source: "",
};

const decisionOptions = [
  { value: "recommit", label: "I desire to recommit my life to Christ" },
  { value: "baptism", label: "I desire to give my life to Christ in Baptism now" },
  { value: "closer-walk", label: "I attend a non-Adventist church but I desire a closer walk with Jesus" },
  { value: "bible-study", label: "I desire Bible study" },
  { value: "prayer", label: "I need special prayer" },
  { value: "other", label: "Other" },
];

const adventistOptions = [
  { value: "baptized", label: "Yes, I am a baptized member of the SDA Church" },
  { value: "not-member", label: "No, I am not a baptized member of the SDA Church" },
  { value: "former", label: "I am a former member of the SDA church" },
];

const ageOptions = [
  { value: "10-15", label: "10-15" },
  { value: "15-19", label: "15-19" },
  { value: "19-29", label: "19-29" },
  { value: "over-29", label: "Over 29" },
  { value: "other", label: "Other" },
];

const sourceOptions = [
  { value: "youtube", label: "YouTube Livestream" },
  { value: "social", label: "Facebook/Social media" },
  { value: "instructor", label: "Bible instructor" },
  { value: "friend", label: "Friends/Family member" },
  { value: "other", label: "Other" },
];

const STORAGE_KEY = "lsda:decision-draft";

interface Step {
  id: 1 | 2 | 3;
  title: string;
  icon: typeof Cross;
  /** Fields that must be filled before user can leave this step */
  required: (keyof FormData)[];
}

const STEPS: Step[] = [
  { id: 1, title: "About you",   icon: Cross,     required: ["name", "phone"] },
  { id: 2, title: "Your decision", icon: HandHeart, required: ["decision", "isAdventist"] },
  { id: 3, title: "Details",     icon: BookOpen,  required: ["source"] },
];

export default function DecisionCardPage() {
  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [attempted, setAttempted] = useState(false);

  // Restore draft on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.formData) setFormData({ ...EMPTY, ...parsed.formData });
        if (parsed.step && [1, 2, 3].includes(parsed.step)) setStep(parsed.step);
      }
    } catch {
      // ignore corrupt draft
    }
  }, []);

  // Persist draft on change.
  useEffect(() => {
    if (isSuccess) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, step }));
    } catch {
      // storage full or disabled — silent
    }
  }, [formData, step, isSuccess]);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const currentStep = STEPS.find((s) => s.id === step)!;
  const isStepValid = useMemo(
    () => currentStep.required.every((f) => formData[f].trim().length > 0),
    [currentStep, formData],
  );

  const goNext = () => {
    setAttempted(true);
    if (!isStepValid) return;
    setAttempted(false);
    setError("");
    if (step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setAttempted(false);
    setError("");
    if (step > 1) {
      setStep((s) => (s - 1) as 1 | 2 | 3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!isStepValid) return;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _hp: "", _ts: Date.now() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit decision");
      }

      setIsSuccess(true);
      sessionStorage.removeItem(STORAGE_KEY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData(EMPTY);
    setStep(1);
    setAttempted(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Compact hero — desktop pairs heading with scripture */}
      <section className="relative bg-gradient-to-br from-[var(--primary-hover)] via-[var(--primary)] to-[#CA8A04] px-6 py-16 sm:py-20 overflow-hidden">
        <VesperLight intensity="rich" />
        <div className="relative z-10 max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm mb-5 ring-1 ring-white/20">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)]">
              My Decision Card
            </h1>
            <p className="mt-3 text-base sm:text-lg text-white/85 max-w-xl mx-auto lg:mx-0">
              We&rsquo;re grateful you&rsquo;ve decided to take a step toward Christ. Share a few details and we&rsquo;ll reach out.
            </p>
          </motion.div>
          <motion.blockquote
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block border-l-2 border-[var(--accent-warm)] pl-6 text-white/85 italic font-[family-name:var(--font-playfair)] leading-relaxed"
          >
            &ldquo;For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.&rdquo;
            <cite className="block mt-3 text-[var(--accent-warm)] text-sm font-medium not-italic">
              — John 3:16
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* Wizard */}
      <section className="px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-[var(--surface)] dark:bg-stone-900 rounded-2xl shadow-xl p-8 sm:p-12 text-center border border-[var(--border-subtle)]"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3 font-[family-name:var(--font-playfair)]">
                Thank You for Your Decision!
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-7 max-w-md mx-auto">
                We&rsquo;ve received your decision and will reach out soon. May God continue to bless you on your journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" onClick={handleReset} leftIcon={<Heart className="w-5 h-5" />}>
                  Submit Another Response
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")}>
                  Return to Home
                </Button>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[var(--surface)] dark:bg-stone-900 rounded-2xl shadow-xl overflow-hidden border border-[var(--border-subtle)] dark:border-stone-800"
            >
              <ProgressDots step={step} onJump={(s) => setStep(s)} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 flex items-center justify-center">
                      <currentStep.icon className="w-5 h-5 text-[var(--primary)] dark:text-[var(--accent-lilac)]" />
                    </div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-[family-name:var(--font-playfair)]">
                      Step {step}: {currentStep.title}
                    </h2>
                  </div>

                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="Full Name"
                          required
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          error={attempted && !formData.name.trim() ? "Required" : undefined}
                        />
                        <Input
                          label="Phone Number"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder={process.env.NEXT_PUBLIC_CHURCH_PHONE || "Phone number"}
                          leftIcon={<Phone className="w-5 h-5" />}
                          error={attempted && !formData.phone.trim() ? "Required" : undefined}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Select
                          label="Age Group"
                          value={formData.ageGroup}
                          onChange={(e) => handleChange("ageGroup", e.target.value)}
                          options={ageOptions}
                          placeholder="Select your age group"
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="your@email.com"
                          leftIcon={<Mail className="w-5 h-5" />}
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <Select
                        label="My Decision"
                        required
                        value={formData.decision}
                        onChange={(e) => handleChange("decision", e.target.value)}
                        options={decisionOptions}
                        placeholder="Please select the appropriate response"
                        error={attempted && !formData.decision ? "Required" : undefined}
                      />
                      <Select
                        label="Are you a member of the Adventist Church?"
                        required
                        value={formData.isAdventist}
                        onChange={(e) => handleChange("isAdventist", e.target.value)}
                        options={adventistOptions}
                        placeholder="Select your membership status"
                        error={attempted && !formData.isAdventist ? "Required" : undefined}
                      />
                      <Textarea
                        label="Prayer Requests"
                        value={formData.prayerRequest}
                        onChange={(e) => handleChange("prayerRequest", e.target.value)}
                        placeholder="What would you like us to pray for?"
                        rows={4}
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <Input
                        label="Street Address"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Enter your street address"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="Parish / State"
                          value={formData.parish}
                          onChange={(e) => handleChange("parish", e.target.value)}
                          placeholder="e.g., St. James"
                          leftIcon={<MapPin className="w-5 h-5" />}
                        />
                        <Input
                          label="Country"
                          value={formData.country}
                          onChange={(e) => handleChange("country", e.target.value)}
                          placeholder="e.g., Jamaica"
                          leftIcon={<Globe className="w-5 h-5" />}
                        />
                      </div>
                      <Select
                        label="How did you learn about this service?"
                        required
                        value={formData.source}
                        onChange={(e) => handleChange("source", e.target.value)}
                        options={sourceOptions}
                        placeholder="Select how you found us"
                        error={attempted && !formData.source ? "Required" : undefined}
                      />
                      <Textarea
                        label="Questions or Comments"
                        value={formData.comments}
                        onChange={(e) => handleChange("comments", e.target.value)}
                        placeholder="Anything else you'd like us to know?"
                        rows={3}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer — navigation / submit */}
              <div className="px-6 sm:px-8 py-5 bg-stone-50 dark:bg-stone-800/50 border-t border-[var(--border-subtle)] dark:border-stone-800 flex flex-col gap-3">
                {error && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-400 text-sm">
                    {error}
                  </div>
                )}
                {attempted && !isStepValid && !error && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-stone-800 dark:text-stone-200 text-sm">
                    Please fill in the required fields before continuing.
                  </div>
                )}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    disabled={step === 1}
                    leftIcon={<ArrowLeft className="w-5 h-5" />}
                  >
                    Back
                  </Button>
                  {step < 3 ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={goNext}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      loadingText="Submitting..."
                      leftIcon={<MessageCircle className="w-5 h-5" />}
                    >
                      Submit My Decision
                    </Button>
                  )}
                </div>
                <p className="text-xs text-center text-stone-500 dark:text-stone-400">
                  Your responses are saved locally as you progress.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Mobile scripture (desktop shows in hero) */}
      <section className="lg:hidden px-6 py-10 border-t border-[var(--border-subtle)]">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="text-stone-700 dark:text-stone-300 italic font-[family-name:var(--font-playfair)] leading-relaxed">
            &ldquo;For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.&rdquo;
          </blockquote>
          <cite className="block mt-3 text-[var(--primary)] dark:text-[var(--accent-lilac)] text-sm font-medium not-italic">
            — John 3:16
          </cite>
        </div>
      </section>
    </div>
  );
}

interface ProgressDotsProps {
  step: 1 | 2 | 3;
  onJump: (s: 1 | 2 | 3) => void;
}

function ProgressDots({ step, onJump }: ProgressDotsProps) {
  return (
    <div className="px-6 sm:px-8 pt-6 pb-2">
      <ol className="flex items-center gap-2 sm:gap-3" aria-label="Progress">
        {STEPS.map((s, idx) => {
          const isCurrent = s.id === step;
          const isComplete = s.id < step;
          const reachable = s.id <= step;
          return (
            <li key={s.id} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => reachable && onJump(s.id)}
                disabled={!reachable}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 group transition-opacity",
                  reachable ? "cursor-pointer" : "cursor-not-allowed opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all",
                    isCurrent
                      ? "bg-[var(--primary)] text-white shadow-md shadow-[rgba(234,179,8,0.30)] ring-4 ring-[var(--primary)]/20"
                      : isComplete
                      ? "bg-[var(--primary)]/15 text-[var(--primary)] dark:text-[var(--accent-lilac)]"
                      : "bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400",
                  )}
                >
                  {isComplete ? <Check className="w-4 h-4" /> : s.id}
                </span>
                <span
                  className={cn(
                    "hidden sm:inline text-sm font-medium truncate",
                    isCurrent ? "text-stone-900 dark:text-stone-100" : "text-stone-500 dark:text-stone-400",
                  )}
                >
                  {s.title}
                </span>
              </button>
              {idx < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "flex-1 h-0.5 rounded-full transition-colors",
                    s.id < step ? "bg-[var(--primary)]/60" : "bg-stone-200 dark:bg-stone-700",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
