"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Cross, BookOpen, Users, Phone, MessageCircle, Sparkles } from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DecisionCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export function DecisionCardModal({ isOpen, onClose }: DecisionCardModalProps) {
  const [formData, setFormData] = useState<FormData>({
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle scroll within the modal to shrink header
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setIsScrolled(scrollTop > 50);
    }
  }, []);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
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
      });
      onClose();
    }, 2000);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-stone-900 shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="decision-card-title"
            >
              {/* Collapsible Header */}
              <motion.div 
                className={cn(
                  "relative bg-gradient-to-br from-amber-600 via-amber-700 to-orange-700 transition-all duration-300 ease-out flex-shrink-0",
                  isScrolled ? "py-3 px-4" : "px-6 py-8 sm:px-8 sm:py-10"
                )}
              >
                {/* Decorative elements - hide when scrolled */}
                <AnimatePresence>
                  {!isScrolled && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" 
                      />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" 
                      />
                    </>
                  )}
                </AnimatePresence>

                <button
                  onClick={onClose}
                  className={cn(
                    "absolute right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white",
                    isScrolled ? "top-1/2 -translate-y-1/2" : "top-4",
                    "z-20"
                  )}
                  style={{ zIndex: 40 }}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className={cn(
                  "relative z-10 text-center transition-all duration-300",
                  isScrolled ? "flex items-center justify-between text-left" : ""
                )}>
                  {/* Heart Icon - smaller when scrolled */}
                  <motion.div 
                    className={cn(
                      "inline-flex items-center justify-center rounded-full bg-white/20 flex-shrink-0",
                      isScrolled ? "w-10 h-10 mb-0 mr-3" : "w-16 h-16 mb-4"
                    )}
                    layout
                  >
                    <Heart className={cn(
                      "text-white transition-all duration-300",
                      isScrolled ? "w-5 h-5" : "w-8 h-8"
                    )} />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <h2
                      id="decision-card-title"
                      className={cn(
                        "font-bold text-white font-[family-name:var(--font-playfair)] transition-all duration-300",
                        isScrolled ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
                      )}
                    >
                      My Decision Card
                    </h2>
                    
                    {/* Welcome message - hide when scrolled */}
                    <AnimatePresence>
                      {!isScrolled && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 text-amber-100 text-sm sm:text-base max-w-md mx-auto"
                        >
                          Your friends from the Lilliput Seventh Day Adventist Church are so happy that you were blessed in worship today.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Form Content - scrollable */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="overflow-y-auto flex-1 px-6 py-6 sm:px-8 sm:py-8"
              >
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                      <Sparkles className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400">
                      We have received your decision and will reach out to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <p className="text-sm text-stone-600 dark:text-stone-400 text-center mb-6">
                      Please complete the form below to share your needs and we will reach out to you as soon as possible.
                    </p>

                    {/* Required Fields Section */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm uppercase tracking-wider">
                        <Cross className="w-4 h-4" />
                        <span>Your Information</span>
                      </div>

                      <Input
                        label="Please enter your name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your full name"
                      />

                      <Select
                        label="My decision"
                        required
                        value={formData.decision}
                        onChange={(e) => handleChange("decision", e.target.value)}
                        options={decisionOptions}
                        placeholder="Please select the appropriate response"
                      />

                      <Select
                        label="Are you a member of the Adventist Church?"
                        required
                        value={formData.isAdventist}
                        onChange={(e) => handleChange("isAdventist", e.target.value)}
                        options={adventistOptions}
                        placeholder="Select your membership status"
                      />

                      <Input
                        label="Please enter your phone number"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="(876) 123-4567"
                        leftIcon={<Phone className="w-5 h-5" />}
                      />

                      <Select
                        label="Please select your age group"
                        value={formData.ageGroup}
                        onChange={(e) => handleChange("ageGroup", e.target.value)}
                        options={ageOptions}
                        placeholder="Select age group"
                      />

                      <Input
                        label="Please enter your address"
                        required
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Street address"
                      />
                    </div>

                    {/* Location Section */}
                    <div className="space-y-5 pt-4 border-t border-stone-200 dark:border-stone-700">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm uppercase tracking-wider">
                        <Users className="w-4 h-4" />
                        <span>Location Details</span>
                      </div>

                      <Input
                        label="What Parish/State do you live in?"
                        value={formData.parish}
                        onChange={(e) => handleChange("parish", e.target.value)}
                        placeholder="e.g., St. James"
                      />

                      <Input
                        label="What country do you live in?"
                        value={formData.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                        placeholder="e.g., Jamaica"
                      />

                      <Input
                        label="Please enter your email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-5 pt-4 border-t border-stone-200 dark:border-stone-700">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" />
                        <span>Additional Information</span>
                      </div>

                      <Textarea
                        label="What would you like us to pray for?"
                        value={formData.prayerRequest}
                        onChange={(e) => handleChange("prayerRequest", e.target.value)}
                        placeholder="Share your prayer requests..."
                        rows={3}
                      />

                      <Textarea
                        label="Please type any questions and/or comments that you have"
                        value={formData.comments}
                        onChange={(e) => handleChange("comments", e.target.value)}
                        placeholder="Your questions or comments..."
                        rows={3}
                      />

                      <Select
                        label="How did you learn about this service?"
                        required
                        value={formData.source}
                        onChange={(e) => handleChange("source", e.target.value)}
                        options={sourceOptions}
                        placeholder="Select how you found us"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-stone-200 dark:border-stone-700">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        isLoading={isSubmitting}
                        loadingText="Submitting..."
                        leftIcon={<MessageCircle className="w-5 h-5" />}
                      >
                        Submit My Decision
                      </Button>
                      <p className="mt-3 text-xs text-center text-stone-500 dark:text-stone-400">
                        * Indicates required question
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}

// Trigger Button Component
interface DecisionCardTriggerProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "terracotta";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export function DecisionCardTrigger({
  className,
  variant = "primary",
  size = "md",
  children,
}: DecisionCardTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsOpen(true)}
        leftIcon={<Heart className="w-5 h-5" />}
      >
        {children || "My Decision Card"}
      </Button>
      <DecisionCardModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
