"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send, Heart, Loader2, AlertCircle, CheckCircle, WifiOff, RefreshCw } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input, Textarea, Checkbox } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { FormErrors, NetworkStatus } from "@/types";

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

export default function ContactPage() {
  const submitContact = useMutation(api.contact.submit);
  const submitPrayer = useMutation(api.prayerRequests.submit);

  const contactFormRef = useRef<HTMLFormElement>(null);
  const prayerFormRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    wasOffline: false,
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactErrors, setContactErrors] = useState<FormErrors>({});
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactRetryCount, setContactRetryCount] = useState(0);

  const [prayerForm, setPrayerForm] = useState({
    name: "",
    email: "",
    request: "",
    isPublic: false,
  });
  const [prayerErrors, setPrayerErrors] = useState<FormErrors>({});
  const [prayerSubmitting, setPrayerSubmitting] = useState(false);
  const [prayerSuccess, setPrayerSuccess] = useState(false);
  const [prayerError, setPrayerError] = useState<string | null>(null);
  const [prayerRetryCount, setPrayerRetryCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setNetworkStatus(prev => ({ isOnline: true, wasOffline: prev.wasOffline || !prev.isOnline }));
    const handleOffline = () => setNetworkStatus({ isOnline: false, wasOffline: true });
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    setNetworkStatus({ isOnline: navigator.onLine, wasOffline: false });
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.focus();
    }
  }, [contactSuccess, prayerSuccess, contactError, prayerError]);

  const validateContactForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!contactForm.name.trim()) {
      errors.name = "Name is required";
    } else if (contactForm.name.length > 100) {
      errors.name = "Name must be less than 100 characters";
    }
    
    if (!contactForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(contactForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!contactForm.message.trim()) {
      errors.message = "Message is required";
    } else if (contactForm.message.length > 2000) {
      errors.message = "Message must be less than 2000 characters";
    }
    
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePrayerForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!prayerForm.name.trim()) {
      errors.name = "Name is required";
    } else if (prayerForm.name.length > 100) {
      errors.name = "Name must be less than 100 characters";
    }
    
    if (!prayerForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(prayerForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!prayerForm.request.trim()) {
      errors.message = "Prayer request is required";
    } else if (prayerForm.request.length > 2000) {
      errors.message = "Prayer request must be less than 2000 characters";
    }
    
    setPrayerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactSuccess(false);
    setContactError(null);
    
    if (!networkStatus.isOnline) {
      setContactError("You appear to be offline. Please check your internet connection and try again.");
      return;
    }
    
    if (!validateContactForm()) {
      return;
    }
    
    setContactSubmitting(true);
    
    try {
      await submitContact({
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
      });
      setContactSuccess(true);
      setContactForm({ name: "", email: "", message: "" });
      setContactRetryCount(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      setContactError(message);
      setContactRetryCount(prev => prev + 1);
    } finally {
      setContactSubmitting(false);
    }
  };

  const handlePrayerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPrayerSuccess(false);
    setPrayerError(null);
    
    if (!networkStatus.isOnline) {
      setPrayerError("You appear to be offline. Please check your internet connection and try again.");
      return;
    }
    
    if (!validatePrayerForm()) {
      return;
    }
    
    setPrayerSubmitting(true);
    
    try {
      await submitPrayer({
        name: prayerForm.name,
        email: prayerForm.email,
        request: prayerForm.request,
        isPublic: prayerForm.isPublic,
      });
      setPrayerSuccess(true);
      setPrayerForm({ name: "", email: "", request: "", isPublic: false });
      setPrayerRetryCount(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit prayer request. Please try again.";
      setPrayerError(message);
      setPrayerRetryCount(prev => prev + 1);
    } finally {
      setPrayerSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-amber-700 dark:bg-amber-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-200 font-medium mb-4 block">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-amber-100 leading-relaxed">
              We&apos;d love to hear from you. Whether you have questions, need 
              prayer, or want to learn more about our church.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2">
                Address
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                Lot 200-202, Lilliput District
                <br />
                Montego Bay, St. James
                <br />
                Jamaica
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2">
                Phone
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                <a href="tel:+18761234567" className="hover:text-amber-700 dark:hover:text-amber-400">
                  (876) 123-4567
                </a>
                <br />
                <span className="text-xs text-stone-400">
                  Mon-Fri, 9:00 AM - 4:00 PM
                </span>
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2">
                Email
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                <a 
                  href="mailto:lhamilton@westjamaica.org" 
                  className="hover:text-amber-700 dark:hover:text-amber-400"
                >
                  lhamilton@westjamaica.org
                </a>
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2">
                Office Hours
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                Monday - Friday
                <br />
                9:00 AM - 4:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Network Status Banner */}
          {!networkStatus.isOnline && (
            <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3" role="alert">
              <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">You&apos;re currently offline</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Some features may be unavailable until you reconnect.</p>
              </div>
            </div>
          )}
          
          {/* Status announcements for screen readers */}
          <div
            ref={statusRef}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {contactSuccess && "Contact form submitted successfully"}
            {prayerSuccess && "Prayer request submitted successfully"}
            {contactError && `Contact form error: ${contactError}`}
            {prayerError && `Prayer request error: ${prayerError}`}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                Send Us a Message
              </h2>
              {contactSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3" role="alert">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Message sent successfully!</p>
                    <p className="text-sm text-green-700 dark:text-green-300">We&apos;ll get back to you soon.</p>
                  </div>
                </div>
              )}
              {contactError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3" role="alert">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800 dark:text-red-200">{contactError}</p>
                    {contactRetryCount > 0 && (
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Attempt {contactRetryCount} of 3
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleContactSubmit}
                      disabled={contactSubmitting}
                      className="mt-2 text-sm text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" aria-hidden="true" />
                      Try again
                    </button>
                  </div>
                </div>
              )}
              <form ref={contactFormRef} onSubmit={handleContactSubmit} className="space-y-6" noValidate>
                <Input
                  label="Your Name"
                  placeholder="John Doe"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  error={contactErrors.name}
                  maxLength={100}
                  required
                  aria-describedby={contactErrors.name ? "contact-name-error" : undefined}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  error={contactErrors.email}
                  maxLength={254}
                  required
                  autoComplete="email"
                  aria-describedby={contactErrors.email ? "contact-email-error" : undefined}
                />
                <Textarea
                  label="Message"
                  placeholder="How can we help you?"
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  error={contactErrors.message}
                  maxLength={2000}
                  showCount
                  required
                  aria-describedby={contactErrors.message ? "contact-message-error" : undefined}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={contactSubmitting}
                  rightIcon={contactSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                >
                  {contactSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Prayer Request Form */}
            <div id="prayer" className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Heart className="w-6 h-6 text-amber-700 dark:text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Prayer Request
                </h2>
              </div>
              <p className="text-stone-600 dark:text-stone-300 mb-6">
                We would be honored to pray for you. Submit your prayer request 
                below, and our prayer team will lift you up.
              </p>
              {prayerSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3" role="alert">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Prayer request submitted!</p>
                    <p className="text-sm text-green-700 dark:text-green-300">We&apos;re praying for you.</p>
                  </div>
                </div>
              )}
              {prayerError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3" role="alert">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800 dark:text-red-200">{prayerError}</p>
                    {prayerRetryCount > 0 && (
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Attempt {prayerRetryCount} of 3
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handlePrayerSubmit}
                      disabled={prayerSubmitting}
                      className="mt-2 text-sm text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" aria-hidden="true" />
                      Try again
                    </button>
                  </div>
                </div>
              )}
              <form ref={prayerFormRef} onSubmit={handlePrayerSubmit} className="space-y-6" noValidate>
                <Input
                  label="Your Name"
                  placeholder="John Doe"
                  value={prayerForm.name}
                  onChange={(e) => setPrayerForm({ ...prayerForm, name: e.target.value })}
                  error={prayerErrors.name}
                  maxLength={100}
                  required
                  aria-describedby={prayerErrors.name ? "prayer-name-error" : undefined}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={prayerForm.email}
                  onChange={(e) => setPrayerForm({ ...prayerForm, email: e.target.value })}
                  error={prayerErrors.email}
                  maxLength={254}
                  required
                  autoComplete="email"
                  aria-describedby={prayerErrors.email ? "prayer-email-error" : undefined}
                />
                <Textarea
                  label="Prayer Request"
                  placeholder="How can we pray for you?"
                  rows={5}
                  value={prayerForm.request}
                  onChange={(e) => setPrayerForm({ ...prayerForm, request: e.target.value })}
                  error={prayerErrors.message}
                  maxLength={2000}
                  showCount
                  required
                  aria-describedby={prayerErrors.message ? "prayer-request-error" : undefined}
                />
                <Checkbox
                  label="Share anonymously on prayer list"
                  helperText="If checked, your name will not be shared with the congregation"
                  checked={prayerForm.isPublic}
                  onChange={(e) => setPrayerForm({ ...prayerForm, isPublic: e.target.checked })}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  disabled={prayerSubmitting}
                  rightIcon={prayerSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
                >
                  {prayerSubmitting ? "Submitting..." : "Submit Prayer Request"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Find Us
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              Located in the beautiful Lilliput District of Montego Bay, we&apos;re 
              easy to find and would love to welcome you.
            </p>
          </div>
          <div className="aspect-[21/9] bg-stone-200 dark:bg-stone-700 rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3797.1234567890123!2d-77.9194!3d18.4762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI4JzM0LjMiTiA3N8KwNTUlMDkuOCJX!5e0!3m2!1sen!2sjm!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lilliput SDA Church Location"
              onError={(e) => {
                const target = e.currentTarget as HTMLIFrameElement;
                target.style.display = 'none';
              }}
            />
            <noscript>
              <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 p-8 text-center">
                <div>
                  <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <p className="text-stone-600 dark:text-stone-300">
                    Lilliput SDA Church<br />
                    Lot 200-202, Lilliput District<br />
                    Montego Bay, St. James<br />
                    Jamaica
                  </p>
                  <a 
                    href="https://maps.google.com/?q=18.4762,-77.9194" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </noscript>
          </div>
        </div>
      </section>
    </div>
  );
}
