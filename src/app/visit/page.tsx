"use client";

import { MapPin, Clock, Calendar, Coffee, Car, Users, Shirt, Baby } from "lucide-react";
import Link from "next/link";

export default function VisitPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-amber-700 dark:bg-amber-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-200 font-medium mb-4 block">
              We Can&apos;t Wait to Meet You
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Plan Your Visit
            </h1>
            <p className="text-xl text-amber-100 leading-relaxed">
              Whether you&apos;re new to the area, exploring faith, or looking for a church home,
              we&apos;d love to welcome you this Sabbath.
            </p>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-stone-800 p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Sabbath Service Schedule
                </h2>
                <p className="text-stone-500 dark:text-stone-400">Every Saturday</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-stone-50 dark:bg-stone-700/50 p-5 rounded-xl">
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-1">9:00 AM</div>
                <div className="text-stone-600 dark:text-stone-300 font-medium">Sabbath School</div>
                <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">Bible study & fellowship</div>
              </div>
              
              <div className="bg-stone-50 dark:bg-stone-700/50 p-5 rounded-xl">
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-1">11:00 AM</div>
                <div className="text-stone-600 dark:text-stone-300 font-medium">Divine Service</div>
                <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">Worship & sermon</div>
              </div>
              
              <div className="bg-stone-50 dark:bg-stone-700/50 p-5 rounded-xl">
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-1">1:00 PM</div>
                <div className="text-stone-600 dark:text-stone-300 font-medium">Lunch Break</div>
                <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">Fellowship & refreshments</div>
              </div>
              
              <div className="bg-stone-50 dark:bg-stone-700/50 p-5 rounded-xl">
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-1">2:30 PM</div>
                <div className="text-stone-600 dark:text-stone-300 font-medium">Afternoon Program</div>
                <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">Praise, prayer & fellowship</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 lg:py-24 bg-stone-50 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              What to Expect
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              We want you to feel comfortable and at home. Here&apos;s what you can expect when you visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                Arrive Early
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                Come 10-15 minutes early to find parking and get settled. Our greeters will welcome you at the entrance.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <Shirt className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                Dress Code
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                Come as you are. Most of us dress smart-casual. We believe God cares more about your heart than your outfit.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <Baby className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                Kids & Youth
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                Children have their own Sabbath School classes. Youth meet together during the afternoon program.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <Coffee className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                Fellowship Meal
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                After service, we share a potluck lunch together. Everyone is invited to join!
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                Friendly Faces
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                You&apos;ll be greeted with warm smiles and handshakes. Don&apos;t worry about knowing anyone - we&apos;ll find you!
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                Parking
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm">
                Free parking available on church grounds. Limited spaces for those with mobility needs near the entrance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-700 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    Location
                  </h2>
                </div>
              </div>
              
              <div className="space-y-4 text-stone-600 dark:text-stone-300">
                <p className="text-lg">
                  <strong>Address:</strong><br />
                  Lot 200-202, Lilliput District<br />
                  Montego Bay, St. James<br />
                  Jamaica
                </p>
                <p>
                  <strong>Landmarks:</strong><br />
                  Near Lilliput Primary School<br />
                  About 15 minutes from downtown Montego Bay
                </p>
                <div className="pt-4">
                  <a
                    href="https://maps.google.com/?q=Lilliput+District+Montego+Bay+Jamaica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            <div className="aspect-video bg-stone-200 dark:bg-stone-700 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3797.1234567890123!2d-77.9194!3d18.4762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI4JzM0LjMiTiA3N8KwNTUlMDkuOCJX!5e0!3m2!1sen!2sjm!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lilliput SDA Church Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 lg:py-24 bg-amber-700 dark:bg-amber-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              className="px-8 py-4 bg-white text-amber-700 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="tel:+18761234567"
              className="px-8 py-4 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition-colors"
            >
              Call (876) 123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
