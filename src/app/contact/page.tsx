"use client";

import { ContactForm, PrayerRequestForm } from "@/components/forms";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfoGrid } from "@/components/sections/ContactInfoGrid";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        badge="Get In Touch"
        title="Contact Us"
        description="We'd love to hear from you. Whether you have questions, need prayer, or want to learn more about our church."
        theme="amber"
      />

      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactInfoGrid />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <div id="prayer">
              <PrayerRequestForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Find Us
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              Located in the beautiful Lilliput area of Montego Bay, we&apos;re
              easy to find and would love to welcome you.
            </p>
          </div>
          <MapEmbed
            aspectRatio="wide"
            title="Lilliput SDA Church Location"
          />
        </div>
      </section>
    </div>
  );
}
