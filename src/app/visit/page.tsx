"use client";

import { useState } from "react";
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

const scheduleItems = [
  {
    time: "9:00 AM",
    title: "Sabbath School",
    description: "Bible study & fellowship",
    icon: Clock,
    highlight: false,
  },
  {
    time: "11:00 AM",
    title: "Divine Service",
    description: "Worship & sermon",
    icon: Calendar,
    highlight: true,
  },
  {
    time: "1:00 PM",
    title: "Lunch Break",
    description: "Fellowship & refreshments",
    icon: Coffee,
    highlight: false,
  },
  {
    time: "2:30 PM",
    title: "Afternoon Program",
    description: "Praise, prayer & fellowship",
    icon: Users,
    highlight: false,
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
  const [activeScheduleIndex, setActiveScheduleIndex] = useState(1);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 dark:from-amber-900 dark:via-amber-800 dark:to-amber-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-amber-100 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              We Can&apos;t Wait to Meet You
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Plan Your Visit
            </h1>
            <p className="text-xl text-amber-100 leading-relaxed max-w-2xl">
              Whether you&apos;re new to the area, exploring faith, or looking for a church home,
              we&apos;d love to welcome you this Sabbath.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-50 dark:from-stone-900 to-transparent" />
      </section>

      {/* Interactive Service Schedule */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    Sabbath Service Schedule
                  </h2>
                  <p className="text-stone-500 dark:text-stone-400">Every Saturday</p>
                </div>
              </div>
            </div>

            {/* Desktop Timeline */}
            <div className="hidden md:grid md:grid-cols-4 divide-x divide-stone-100 dark:divide-stone-700">
              {scheduleItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === activeScheduleIndex;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveScheduleIndex(index)}
                    className={`relative p-6 text-left transition-all duration-300 hover:bg-stone-50 dark:hover:bg-stone-700/50 ${
                      isActive ? "bg-amber-50 dark:bg-amber-900/20" : ""
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                    )}
                    <div className={`text-2xl font-bold mb-1 ${isActive ? "text-amber-600 dark:text-amber-400" : "text-stone-900 dark:text-stone-100"}`}>
                      {item.time}
                    </div>
                    <div className="font-semibold text-stone-800 dark:text-stone-200 mb-1">
                      {item.title}
                    </div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">
                      {item.description}
                    </div>
                    <div className={`mt-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-amber-500 text-white" : "bg-stone-100 dark:bg-stone-700 text-stone-400"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden p-4">
              <div className="space-y-3">
                {scheduleItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeScheduleIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveScheduleIndex(index)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : "bg-stone-50 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-xl font-bold mb-1 ${isActive ? "text-white" : "text-amber-600 dark:text-amber-400"}`}>
                            {item.time}
                          </div>
                          <div className={`font-semibold ${isActive ? "text-white" : "text-stone-800 dark:text-stone-200"}`}>
                            {item.title}
                          </div>
                          <div className={`text-sm ${isActive ? "text-amber-100" : "text-stone-500 dark:text-stone-400"}`}>
                            {item.description}
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-white/20" : "bg-amber-100 dark:bg-amber-900/30"}`}>
                          <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect - Enhanced Cards */}
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
            {whatToExpectItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-amber-200 dark:hover:border-amber-700"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location Section - Split Layout */}
      <section className="py-16 lg:py-24 bg-white dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Info Side */}
            <div className="order-2 lg:order-1">
              <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium mb-6">
                Find Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-8">
                Visit Us This Sabbath
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">Address</h3>
                    <p className="text-stone-600 dark:text-stone-400">
                      Lot 200-202, Lilliput District<br />
                      Montego Bay, St. James<br />
                      Jamaica
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Car className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">Landmarks</h3>
                    <p className="text-stone-600 dark:text-stone-400">
                      Near Lilliput Primary School<br />
                      About 15 minutes from downtown Montego Bay
                    </p>
                  </div>
                </div>
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

            {/* Map Side */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] bg-stone-200 dark:bg-stone-700 rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3797.1234567890123!2d-77.9194!3d18.4762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI4JzM0LjMiTiA3N8KwNTUlMDkuOCJX!5e0!3m2!1sen!2sjm!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lilliput SDA Church Location"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 ring-1 ring-black/5 rounded-2xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
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

      {/* Contact CTA */}
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
