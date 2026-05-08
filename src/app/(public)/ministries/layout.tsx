import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ministries | Lilliput SDA Church",
  description:
    "Youth, Women, Men, Music, Health, Community Services, and more. Find your place to serve at Lilliput SDA Church in Montego Bay, Jamaica.",
  openGraph: {
    title: "Ministries | Lilliput SDA Church",
    description:
      "Youth, Women, Men, Music, Health, Community Services, and more. Find your place to serve at Lilliput SDA Church in Montego Bay, Jamaica.",
    url: "/ministries",
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
    title: "Ministries | Lilliput SDA Church",
    description:
      "Youth, Women, Men, Music, Health, Community Services, and more. Find your place to serve at Lilliput SDA Church in Montego Bay, Jamaica.",
    images: ["/images/logos/og-image.png"],
  },
}

export default function MinistriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
