"use client";

import { ContactForm, PrayerRequestForm } from "@/components/forms";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfoGrid } from "@/components/sections/ContactInfoGrid";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge={<span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-amber-200 font-semibold text-sm backdrop-blur-sm"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />Get In Touch</span>}
        title="Contact Us"
        description="We'd love to hear from you. Whether you have questions, need prayer, or want to learn more about our church."
        theme="amber"
      />

      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactInfoGrid />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white dark:bg-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <ContactForm />
            <div id="prayer">
              <PrayerRequestForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-stone-900 dark:text-stone-100 mb-4 font-[family-name:var(--font-playfair)]">
              Find Us
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-lg">
              Located in the beautiful Lilliput area of Montego Bay, we&apos;re
              easy to find and would love to welcome you.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10">
            <MapEmbed
              aspectRatio="wide"
              title="Lilliput SDA Church Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
