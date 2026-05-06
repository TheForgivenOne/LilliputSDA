import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sermons & Media | Lilliput SDA Church",
  description:
    "Watch sermons and worship services from Lilliput SDA Church, St. James, Jamaica.",
  openGraph: {
    title: "Sermons & Media | Lilliput SDA Church",
    description:
      "Watch sermons and worship services from Lilliput SDA Church, St. James, Jamaica.",
    url: "/media",
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
    title: "Sermons & Media | Lilliput SDA Church",
    description:
      "Watch sermons and worship services from Lilliput SDA Church, St. James, Jamaica.",
    images: ["/images/logos/og-image.png"],
  },
}

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
