"use client";

import Link from "next/link";
import { Church, MapPin, Mail, Clock, ExternalLink } from "lucide-react";

const footerLinks = {
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Leadership", href: "/about#leadership" },
    { label: "What We Believe", href: "/about#beliefs" },
    { label: "Contact Us", href: "/contact" },
  ],
  ministries: [
    { label: "Youth Ministries", href: "/ministries", key: "ministries-youth" },
    { label: "Women's Ministry", href: "/ministries", key: "ministries-women" },
    { label: "Men's Ministry", href: "/ministries", key: "ministries-men" },
    { label: "Music Ministry", href: "/ministries", key: "ministries-music" },
  ],
  resources: [
    { label: "Sermons", href: "/media", key: "sermons" },
    { label: "Events & News", href: "/events", key: "events" },
    { label: "Contact", href: "/contact", key: "contact" },
    { label: "My Decision Card", href: "/decision", key: "decision" },
  ],
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/p/Seventh-day-Adventist-Church-Lilliput-100064748378477/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@lilliputsdamedia",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/lilliputsda",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl will-change-opacity" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-500/5 dark:bg-orange-500/5 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl will-change-opacity" />
      
      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Church Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="p-3 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg shadow-amber-600/25 group-hover:shadow-amber-600/40 group-hover:scale-105 transition-all duration-300">
                <Church className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-stone-900 dark:text-white font-[family-name:var(--font-playfair)]">
                  Lilliput SDA
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-500 tracking-wider uppercase">
                  St. James, Jamaica
                </span>
              </div>
            </Link>
            <p className="text-stone-500 dark:text-stone-400 mb-8 leading-relaxed text-lg">
              Growing together in faith since 1974. A warm, welcoming community
              in the heart of St. James, Jamaica.
            </p>

            {/* Contact Info with enhanced styling */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 dark:bg-amber-500/10 rounded-lg mt-0.5">
                  <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                </div>
                <span className="text-stone-600 dark:text-stone-300">
                  Lot 200-202, Lilliput
                  <br />
                  Montego Bay, St. James, Jamaica
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 dark:bg-amber-500/10 rounded-lg">
                  <Mail className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                </div>
                <a
                  href="mailto:lhamilton@westjamaica.org"
                  className="text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  lhamilton@westjamaica.org
                </a>
              </div>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-stone-900 dark:text-white font-bold text-lg mb-6 font-[family-name:var(--font-playfair)]">About</h3>
            <ul className="space-y-3.5">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 footer-link inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries Links */}
          <div>
            <h3 className="text-stone-900 dark:text-white font-bold text-lg mb-6 font-[family-name:var(--font-playfair)]">Ministries</h3>
            <ul className="space-y-3.5">
              {footerLinks.ministries.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 footer-link inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-stone-900 dark:text-white font-bold text-lg mb-6 font-[family-name:var(--font-playfair)]">Resources</h3>
            <ul className="space-y-3.5">
              {footerLinks.resources.map((link) => (
                <li key={link.key || link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 footer-link inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service Times Banner */}
        <div className="mt-16 pt-10 border-t border-stone-200 dark:border-stone-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 dark:from-amber-500/20 dark:to-orange-500/20 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              </div>
              <span className="text-stone-900 dark:text-white font-semibold text-lg">Service Times</span>
            </div>
            <div className="flex flex-wrap gap-6 text-base">
              <div>
                <span className="text-stone-400 dark:text-stone-500">Sabbath School:</span>{" "}
                <span className="text-stone-900 dark:text-white font-semibold">9:30 AM</span>
              </div>
              <div>
                <span className="text-stone-400 dark:text-stone-500">Divine Service:</span>{" "}
                <span className="text-stone-900 dark:text-white font-semibold">11:00 AM</span>
              </div>
              <div>
                <span className="text-stone-400 dark:text-stone-500">AY Society:</span>{" "}
                <span className="text-stone-900 dark:text-white font-semibold">Sat 4:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-200 dark:border-stone-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-stone-400 dark:text-stone-500">
              &copy; {new Date().getFullYear()} Lilliput Seventh-day Adventist
              Church. All rights reserved.
            </p>

            {/* Social Links with hover effects and focus indicators */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2.5 rounded-xl text-stone-400 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 dark:focus-visible:ring-offset-stone-900 focus-visible:text-amber-600 dark:focus-visible:text-amber-400"
                  aria-label={`${social.label} (opens in new tab)`}
                >
                  {social.icon}
                  <ExternalLink className="absolute -top-1 -right-1 w-3 h-3 opacity-0 group-hover:opacity-100 text-amber-600 dark:text-amber-400 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
