import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Story | Lilliput SDA Church",
  description:
    "52 years of faith in St. James. Learn the history, mission, beliefs, and leadership of Lilliput SDA Church.",
  openGraph: {
    title: "Our Story | Lilliput SDA Church",
    description:
      "52 years of faith in St. James. Learn the history, mission, beliefs, and leadership of Lilliput SDA Church.",
    url: "/about",
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
    title: "Our Story | Lilliput SDA Church",
    description:
      "52 years of faith in St. James. Learn the history, mission, beliefs, and leadership of Lilliput SDA Church.",
    images: ["/images/logos/og-image.png"],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
