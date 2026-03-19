"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm, PrayerRequestForm } from "@/components/forms";

export default function ContactPage() {
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />
            
            {/* Prayer Request Form */}
            <div id="prayer">
              <PrayerRequestForm />
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
