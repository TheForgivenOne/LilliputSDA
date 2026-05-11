"use client";

import {
  MapPin,
  Clock,
  Calendar,
  Coffee,
  Car,
  Users,
  Shirt,
  Baby,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { ServiceSchedule } from "@/components/sections/ServiceSchedule";
import { WhatToExpectCard } from "@/components/cards/WhatToExpectCard";
import { PageHero } from "@/components/sections/PageHero";

const scheduleItems = [
  { time: "9:00 AM", title: "Sabbath School",  description: "Bible study & fellowship", icon: Clock },
  { time: "11:00 AM", title: "Divine Service", description: "Worship & sermon",         icon: Calendar },
  { time: "1:30 PM",  title: "Closing",        description: "Blessing & fellowship",     icon: Users },
];

const whatToExpectItems = [
  {
    icon: Clock,
    title: "Arrive Early",
    description:
      "Come 10–15 minutes early to find parking and get settled. Our greeters will welcome you at the entrance.",
  },
  {
    icon: Shirt,
    title: "Dress Code",
    description:
      "Come as you are. Most of us dress smart-casual. We believe God cares more about your heart than your outfit.",
  },
  {
    icon: Baby,
    title: "Kids & Youth",
    description:
      "Children have their own Sabbath School classes. Youth meet together during the afternoon program.",
  },
  {
    icon: Coffee,
    title: "Fellowship Time",
    description:
      "After service, we gather for fellowship. Feel free to stay and connect with the community!",
  },
  {
    icon: Users,
    title: "Friendly Faces",
    description:
      "You'll be greeted with warm smiles and handshakes. Don't worry about knowing anyone — we'll find you!",
  },
  {
    icon: Car,
    title: "Parking",
    description:
      "Free parking available on church grounds. Limited spaces for those with mobility needs near the entrance.",
  },
];

const faqItems = [
  {
    q: "Is there a dress code?",
    a: "Come as you are! Most of our congregation dresses smart-casual. God cares more about your presence than your outfit.",
  },
  {
    q: "Are children welcome?",
    a: "Absolutely. We have Sabbath School classes for all ages — nursery, primary, junior, and youth.",
  },
  {
    q: "How long is the service?",
    a: "The morning service runs about three hours, including Sabbath School at 9 AM and Divine Service at 11 AM, with fellowship time after.",
  },
  {
    q: "Is the church wheelchair accessible?",
    a: "Yes — there is step-free access at the main entrance and dedicated parking near the door. Let us know in advance if you need anything specific.",
  },
  {
    q: "What if I'm not Adventist?",
    a: "You are warmly welcome. Many of our guests are visiting for the first time. There is no membership requirement to attend.",
  },
  {
    q: "Do you stream the service online?",
    a: "Yes — every Sabbath service is streamed on our YouTube channel. Visit the Media page for the latest message.",
  },
];

export default function VisitPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <PageHero
        title="Plan Your Visit"
        description="Whether you're new to the area, exploring faith, or looking for a church home, we'd love to welcome you this Sabbath."
        badge={
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-semibold backdrop-blur-sm">
            <span className="w-2 h-2 bg-[var(--accent-warm)] rounded-full animate-pulse" />
            We Can&apos;t Wait to Meet You
          </span>
        }
        theme="gradient"
      />

      {/* Service schedule — full-width band, no overlap trick */}
      <section className="py-10 lg:py-12 border-b border-[var(--border-subtle)] bg-[var(--surface)]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceSchedule items={scheduleItems} />
        </div>
      </section>

      {/* Map paired with What to expect — the signature visit pairing */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Left: Map + address */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--accent-lilac)] mb-4">
                Find Us
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-100 mb-6 font-[family-name:var(--font-playfair)]">
                Visit Us This Sabbath
              </h2>
              <div className="rounded-3xl overflow-hidden shadow-xl shadow-[rgba(59,58,143,0.10)] mb-6">
                <MapEmbed aspectRatio="standard" showRing />
              </div>
              <address className="not-italic flex items-start gap-3 text-stone-700 dark:text-stone-300 mb-6">
                <MapPin className="w-5 h-5 text-[var(--primary)] dark:text-[var(--accent-lilac)] flex-shrink-0 mt-0.5" />
                <span>
                  Lot 200-202, Lilliput
                  <br />
                  Montego Bay, St. James
                  <br />
                  Jamaica
                </span>
              </address>
              <a
                href="https://maps.google.com/?q=Lilliput+District+Montego+Bay+Jamaica"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold shadow-md shadow-[rgba(59,58,143,0.30)] hover:bg-[var(--primary-hover)] hover:-translate-y-0.5 transition-all group"
              >
                <MapPin className="w-5 h-5" />
                Get Directions
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right: What to expect — stacked cards */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[var(--primary)]/10 text-[var(--primary)] dark:text-[var(--accent-lilac)] mb-4">
                Your First Visit
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-100 mb-6 font-[family-name:var(--font-playfair)]">
                What to Expect
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whatToExpectItems.map((item) => (
                  <WhatToExpectCard key={item.title} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="py-16 lg:py-24 bg-[var(--surface)]/60 border-y border-[var(--border-subtle)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-100 mb-3 font-[family-name:var(--font-playfair)]">
              Common Questions
            </h2>
            <p className="text-stone-600 dark:text-stone-400">
              Quick answers to help you prepare for your visit.
            </p>
          </div>

          <ul className="space-y-3">
            {faqItems.map((item) => (
              <li key={item.q}>
                <details className="group bg-white dark:bg-stone-800 rounded-2xl border border-[var(--border-subtle)] dark:border-stone-700 overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {item.q}
                    </span>
                    <ChevronDown className="w-5 h-5 text-stone-500 transition-transform group-open:rotate-180 flex-shrink-0" />
                  </summary>
                  <div className="px-5 pb-5 text-stone-600 dark:text-stone-300 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA stripe */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[var(--primary-hover)] via-[var(--primary)] to-[#5B4FA0] rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--accent-warm)]/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>
            <div className="relative p-8 md:p-12 lg:p-16 text-center">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-5 font-[family-name:var(--font-playfair)]">
                Questions? We&apos;d Love to Help.
              </h2>
              <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
                Reach out before your visit and we&apos;ll have someone ready to greet you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact?topic=visit#form"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[var(--primary)] rounded-xl font-semibold hover:bg-stone-100 transition-all shadow-lg hover:-translate-y-0.5"
                >
                  Plan a Visit
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/40 text-white rounded-xl font-semibold hover:border-white/80 hover:bg-white/5 transition-all"
                >
                  General Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
