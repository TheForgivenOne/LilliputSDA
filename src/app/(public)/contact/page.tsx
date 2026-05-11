"use client";

import { useEffect, useState } from "react";
import { SmartContactForm } from "@/components/forms";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfoGrid } from "@/components/sections/ContactInfoGrid";

type Topic = "general" | "visit" | "prayer" | "volunteer";

export default function ContactPage() {
  const [initialTopic, setInitialTopic] = useState<Topic>("general");

  // Honor #prayer anchors (deep links from the old design and the MobileBottomBar
  // legacy "Prayer" target) by pre-selecting the prayer topic.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (hash === "prayer") setInitialTopic("prayer");
    else if (hash === "visit") setInitialTopic("visit");
    else if (hash === "volunteer") setInitialTopic("volunteer");
  }, []);

  return (
    <div className="min-h-screen">
      <PageHero
        badge={
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 font-semibold text-sm backdrop-blur-sm">
            <span className="w-2 h-2 bg-[var(--accent-warm)] rounded-full animate-pulse" />
            Get In Touch
          </span>
        }
        title="Contact Us"
        description="One form, four ways to reach us. Pick the topic that fits — we'll route it to the right person."
        theme="amber"
      />

      <section className="py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactInfoGrid />
        </div>
      </section>

      <section className="pb-16 lg:pb-24" id="form">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SmartContactForm initialTopic={initialTopic} />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-stone-900 dark:text-stone-100 mb-3 font-[family-name:var(--font-playfair)]">
              Find Us
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-lg">
              Located in the beautiful Lilliput area of Montego Bay, we&apos;re easy to find — and we would love to welcome you.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[rgba(234,179,8,0.10)]">
            <MapEmbed aspectRatio="wide" title="Lilliput SDA Church Location" />
          </div>
        </div>
      </section>
    </div>
  );
}
