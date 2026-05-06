import type { MetadataRoute } from "next"

const BASE_URL = "https://lilliputsda.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: {
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
    priority: number
  }[] = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/ministries", changeFrequency: "monthly", priority: 0.8 },
    { path: "/media", changeFrequency: "weekly", priority: 0.9 },
    { path: "/events", changeFrequency: "weekly", priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/visit", changeFrequency: "monthly", priority: 0.7 },
  ]

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
