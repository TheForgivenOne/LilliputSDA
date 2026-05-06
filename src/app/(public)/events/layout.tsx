import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events & News | Lilliput SDA Church",
  description:
    "Upcoming events, service times, and announcements from Lilliput SDA Church, Montego Bay.",
  openGraph: {
    title: "Events & News | Lilliput SDA Church",
    description:
      "Upcoming events, service times, and announcements from Lilliput SDA Church, Montego Bay.",
    url: "/events",
    type: "website",
    siteName: "Lilliput SDA Church",
    images: [
      {
        url: "/images/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lilliput SDA Church",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events & News | Lilliput SDA Church",
    description:
      "Upcoming events, service times, and announcements from Lilliput SDA Church, Montego Bay.",
    images: ["/images/logos/og-image.png"],
  },
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
