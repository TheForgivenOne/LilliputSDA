"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

interface MapEmbedProps {
  title?: string;
  className?: string;
  aspectRatio?: "wide" | "standard" | "square";
  showRing?: boolean;
  fallbackAddress?: string;
}

const LILLIPUT_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.347638643808!2d-77.7793647297024!3d18.51318604407663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eda2f58149259c3%3A0xd7988c2e6c4ac6d7!2sLilliput%20Seventh-day%20Adventist%20Church!5e0!3m2!1sen!2sus!4v1773961911086!5m2!1sen!2sus";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir//Lilliput+Seventh-day+Adventist+Church,+Lot+200-202,+Lilliput,+Montego+Bay,+Jamaica/@18.513186,-77.779365,15z?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D";

const ASPECT_RATIOS = {
  wide: "aspect-[21/9]",
  standard: "aspect-[4/3]",
  square: "aspect-square",
};

export function MapEmbed({
  title = "Lilliput SDA Church Location",
  className = "",
  aspectRatio = "standard",
  showRing = false,
  fallbackAddress,
}: MapEmbedProps) {
  const [mapError, setMapError] = useState(false);

  return (
    <div className={`relative ${ASPECT_RATIOS[aspectRatio]} bg-stone-200 dark:bg-stone-700 rounded-2xl overflow-hidden ${className}`}>
      {mapError ? (
        <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-800">
          <div className="text-center p-8">
            <MapPin className="w-12 h-12 text-amber-600 dark:text-amber-500 mx-auto mb-4" />
            <p className="text-stone-600 dark:text-stone-300 font-medium">
              {fallbackAddress ? (
                <>
                  {fallbackAddress}
                  <br />
                  <a
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 dark:text-amber-500 hover:underline mt-2 inline-block"
                  >
                    Get Directions
                  </a>
                </>
              ) : (
                <>
                  Lilliput SDA Church
                  <br />
                  Lot 200-202, Lilliput
                  <br />
                  Montego Bay, St. James
                  <br />
                  Jamaica
                  <br />
                  <a
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 dark:text-amber-500 hover:underline mt-2 inline-block"
                  >
                    Get Directions
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      ) : (
        <>
          <iframe
            src={LILLIPUT_MAP_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title}
            onError={() => setMapError(true)}
            className="w-full h-full"
          />
          {/* Get Directions Button */}
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium"
            aria-label="Get directions to Lilliput SDA Church"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
        </>
      )}
      {showRing && (
        <div className="absolute inset-0 ring-1 ring-black/5 dark:ring-white/5 rounded-2xl pointer-events-none" />
      )}
      <noscript>
        <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 p-8 text-center">
          <div>
            <MapPin className="w-12 h-12 text-amber-600 dark:text-amber-500 mx-auto mb-4" />
            <p className="text-stone-600 dark:text-stone-300">
              Lilliput SDA Church
              <br />
              Lot 200-202, Lilliput
              <br />
              Montego Bay, St. James
              <br />
              Jamaica
              <br />
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-amber-500 hover:underline mt-2 inline-block"
              >
                Get Directions
              </a>
            </p>
          </div>
        </div>
      </noscript>
    </div>
  );
}
