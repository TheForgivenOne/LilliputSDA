import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plan Your Visit | Lilliput SDA Church",
  description:
    "Plan your visit to Lilliput SDA Church in Montego Bay, Jamaica. Service times, directions, what to expect, and answers to common questions.",
  openGraph: {
    title: "Plan Your Visit | Lilliput SDA Church",
    description:
      "Plan your visit to Lilliput SDA Church in Montego Bay, Jamaica. Service times, directions, what to expect, and answers to common questions.",
    url: "/visit",
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
    title: "Plan Your Visit | Lilliput SDA Church",
    description:
      "Plan your visit to Lilliput SDA Church in Montego Bay, Jamaica. Service times, directions, what to expect, and answers to common questions.",
    images: ["/images/logos/og-image.png"],
  },
}

export default function VisitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
