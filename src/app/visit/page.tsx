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
  Phone,
} from "lucide-react";
import Link from "next/link";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { ServiceSchedule } from "@/components/sections/ServiceSchedule";
import { WhatToExpectCard } from "@/components/cards/WhatToExpectCard";
import { InfoItem } from "@/components/ui/InfoItem";
import { PageHero } from "@/components/sections/PageHero";

const scheduleItems = [
  {
    time: "9:00 AM",
    title: "Sabbath School",
    description: "Bible study & fellowship",
    icon: Clock,
  },
  {
    time: "11:00 AM",
    title: "Divine Service",
    description: "Worship & sermon",
    icon: Calendar,
  },
  {
    time: "1:00 PM",
    title: "Lunch Break",
    description: "Fellowship & refreshments",
    icon: Coffee,
  },
  {
    time: "2:30 PM",
    title: "Afternoon Program",
    description: "Praise, prayer & fellowship",
    icon: Users,
  },
];

const whatToExpectItems = [
  {
    icon: Clock,
    title: "Arrive Early",
    description:
      "Come 10-15 minutes early to find parking and get settled. Our greeters will welcome you at the entrance.",
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
    title: "Fellowship Meal",
    description:
      "After service, we share a potluck lunch together. Everyone is invited to join!",
  },
  {
    icon: Users,
    title: "Friendly Faces",
    description:
      "You'll be greeted with warm smiles and handshakes. Don't worry about knowing anyone - we'll find you!",
  },
  {
    icon: Car,
    title: "Parking",
    description:
      "Free parking available on church grounds. Limited spaces for those with mobility needs near the entrance.",
  },
];

export default function VisitPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <PageHero
        title="Plan Your Visit"
        description="Whether you're new to the area, exploring faith, or looking for a church home, we'd love to welcome you this Sabbath."
        badge={
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-amber-100 text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            We Can&apos;t Wait to Meet You
          </span>
        }
        theme="gradient"
      />

      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceSchedule items={scheduleItems} />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium mb-4">
              Your First Visit
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              What to Expect
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-lg">
              We want you to feel comfortable and at home. Here&apos;s what you can expect when you visit us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatToExpectItems.map((item) => (
              <WhatToExpectCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium mb-6">
                Find Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-8">
                Visit Us This Sabbath
              </h2>
              
              <div className="space-y-6">
                <InfoItem icon={MapPin} title="Address">
                  <p className="text-stone-600 dark:text-stone-400">
                    Lot 200-202, Lilliput<br />
                    Montego Bay, St. James<br />
                    Jamaica
                  </p>
                </InfoItem>

                <InfoItem icon={Car} title="Landmarks">
                  <p className="text-stone-600 dark:text-stone-400">
                    Near Lilliput Primary School<br />
                    About 15 minutes from downtown Montego Bay
                  </p>
                </InfoItem>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://maps.google.com/?q=Lilliput+District+Montego+Bay+Jamaica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-all hover:shadow-lg hover:shadow-amber-600/25 group"
                >
                  <MapPin className="w-5 h-5" />
                  Get Directions
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <MapEmbed
                aspectRatio="standard"
                showRing
                className="shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-stone-100 to-stone-50 dark:from-stone-800 dark:to-stone-800/50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                Common Questions
              </h2>
              <p className="text-stone-600 dark:text-stone-400">
                Quick answers to help you prepare for your visit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-stone-700/50 p-6 rounded-xl">
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  Is there a dress code?
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">
                  Come as you are! Most of our congregation dresses smart-casual.
                </p>
              </div>
              <div className="bg-white dark:bg-stone-700/50 p-6 rounded-xl">
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  Are children welcome?
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">
                  Absolutely! We have Sabbath School classes for all ages.
                </p>
              </div>
              <div className="bg-white dark:bg-stone-700/50 p-6 rounded-xl">
                <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  How long is the service?
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm">
                  Our morning service runs about 1.5 hours with fellowship time after.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%2020h10v10H20zM0%200h10v10H0zM10%2010h10v10H10zM20%2030h10v10H20zM30%200h10v10H30zM0%2020h10v10H0z%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%2F%3E%3C%2Fsvg%3E')]" />
            </div>
            <div className="relative p-8 md:p-12 lg:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Questions? We&apos;d Love to Help!
              </h2>
              <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
                If you have any questions before your visit, feel free to reach out.
                We&apos;re here to make your first visit as comfortable as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-all hover:shadow-lg"
                >
                  Contact Us
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+18761234567"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-800/50 text-white rounded-xl font-semibold hover:bg-amber-800/70 transition-all border border-amber-700/50"
                >
                  <Phone className="w-5 h-5" />
                  Call (876) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
