"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function DecisionCardPage() {
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
  const [error, setError] = useState("");

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit decision");
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
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
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-600 via-amber-700 to-orange-700 px-6 py-16 sm:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
              My Decision Card
            </h1>
            <p className="text-lg sm:text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
              Your friends from the Lilliput Seventh Day Adventist Church are so
              happy that you were blessed in worship today and have decided to
              make a change in your life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-6 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-8 sm:p-12 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4 font-[family-name:var(--font-playfair)]">
                Thank You for Your Decision!
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-lg mb-8 max-w-md mx-auto">
                We have received your decision and will reach out to you soon.
                May God continue to bless you on your journey of faith.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={handleReset}
                  leftIcon={<Heart className="w-5 h-5" />}
                >
                  Submit Another Response
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  Return to Home
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Intro */}
              <motion.div variants={itemVariants} className="p-6 sm:p-8 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
                <p className="text-stone-600 dark:text-stone-400 text-center">
                  Please complete the form below to share your needs and we will
                  reach out to you as soon as possible.
                </p>
              </motion.div>

              <div className="p-6 sm:p-8 space-y-10">
                {/* Personal Information */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-amber-200 dark:border-amber-800">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Cross className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    </div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Your Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder={process.env.NEXT_PUBLIC_CHURCH_PHONE || "Phone number"}
                      leftIcon={<Phone className="w-5 h-5" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </motion.div>

                {/* Decision & Faith */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-amber-200 dark:border-amber-800">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <HandHeart className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    </div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Your Decision
                    </h2>
                  </div>

                  <Select
                    label="My Decision"
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
                </motion.div>

                {/* Location */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-amber-200 dark:border-amber-800">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    </div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Location Details
                    </h2>
                  </div>

                  <Input
                    label="Street Address"
                    required
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter your street address"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Parish / State"
                      value={formData.parish}
                      onChange={(e) => handleChange("parish", e.target.value)}
                      placeholder="e.g., St. James"
                    />

                    <Input
                      label="Country"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      placeholder="e.g., Jamaica"
                      leftIcon={<Globe className="w-5 h-5" />}
                    />
                  </div>
                </motion.div>

                {/* Additional Information */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-amber-200 dark:border-amber-800">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    </div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Additional Information
                    </h2>
                  </div>

                  <Textarea
                    label="Prayer Requests"
                    value={formData.prayerRequest}
                    onChange={(e) => handleChange("prayerRequest", e.target.value)}
                    placeholder="What would you like us to pray for?"
                    rows={4}
                  />

                  <Textarea
                    label="Questions or Comments"
                    value={formData.comments}
                    onChange={(e) => handleChange("comments", e.target.value)}
                    placeholder="Please type any questions and/or comments that you have..."
                    rows={4}
                  />

                  <Select
                    label="How did you learn about this service?"
                    required
                    value={formData.source}
                    onChange={(e) => handleChange("source", e.target.value)}
                    options={sourceOptions}
                    placeholder="Select how you found us"
                  />
                </motion.div>
              </div>

              {/* Submit Section */}
              <motion.div
                variants={itemVariants}
                className="p-6 sm:p-8 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-800"
              >
                {error && (
                  <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-700 dark:text-rose-400 text-sm">
                    {error}
                  </div>
                )}
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
                <p className="mt-4 text-xs text-center text-stone-500 dark:text-stone-400">
                  * Indicates required question
                </p>
              </motion.div>
            </motion.form>
          )}
        </div>
      </section>

      {/* Scripture Quote */}
      <section className="px-6 py-12 bg-amber-900">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-amber-100 text-lg sm:text-xl italic font-[family-name:var(--font-playfair)] leading-relaxed">
            &ldquo;For God so loved the world, that he gave his only begotten Son,
            that whosoever believeth in him should not perish, but have
            everlasting life.&rdquo;
          </blockquote>
          <cite className="block mt-4 text-amber-300 font-medium not-italic">
            — John 3:16
          </cite>
        </div>
      </section>
    </div>
  );
}
