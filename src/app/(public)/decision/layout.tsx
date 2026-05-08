import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Decision Card | Lilliput SDA Church",
  description:
    "Make a decision for Christ. Submit your decision card to Lilliput SDA Church in Montego Bay, Jamaica.",
  openGraph: {
    title: "My Decision Card | Lilliput SDA Church",
    description:
      "Make a decision for Christ. Submit your decision card to Lilliput SDA Church in Montego Bay, Jamaica.",
    url: "/decision",
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
    title: "My Decision Card | Lilliput SDA Church",
    description:
      "Make a decision for Christ. Submit your decision card to Lilliput SDA Church in Montego Bay, Jamaica.",
    images: ["/images/logos/og-image.png"],
  },
}

export default function DecisionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
