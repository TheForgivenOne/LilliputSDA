import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Lilliput SDA Church",
  description:
    "Get in touch, send a prayer request, or get directions to Lilliput SDA Church, St. James, Jamaica.",
  openGraph: {
    title: "Contact Us | Lilliput SDA Church",
    description:
      "Get in touch, send a prayer request, or get directions to Lilliput SDA Church, St. James, Jamaica.",
    url: "/contact",
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
    title: "Contact Us | Lilliput SDA Church",
    description:
      "Get in touch, send a prayer request, or get directions to Lilliput SDA Church, St. James, Jamaica.",
    images: ["/images/logos/og-image.png"],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
