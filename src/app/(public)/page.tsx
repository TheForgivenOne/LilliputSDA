"use client";

import { Clock, MapPin, Play } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { CHURCH_IMAGES } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { QuickInfo } from "@/components/sections/QuickInfo";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSplit } from "@/components/sections/AboutSplit";
import { QuickMinistryCard } from "@/components/cards/QuickMinistryCard";
import { CTASection } from "@/components/sections/CTASection";
import { SermonList, VideoModal } from "@/components/media";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { AnchorPillNav } from "@/components/layout/AnchorPillNav";

import { EventsList } from "@/components/sections/EventsList";
import { AnnouncementsList } from "@/components/sections/AnnouncementsList";
import type { YouTubeVideo, ChurchEvent, Announcement } from "@/types";

type SiteContent = {
  key: string;
  content: string | null;
  imageUrl: string | null;
};

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  memberSince: string | null;
  content: string;
};

export default function Home() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(false);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);

  const [sermonVideos, setSermonVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const heroTitle = siteContent.find((c) => c.key === "hero_title")?.content;
  const heroSubtitle = siteContent.find((c) => c.key === "hero_subtitle")?.content;
  const heroDescription = siteContent.find((c) => c.key === "hero_description")?.content;
  const heroImage = siteContent.find((c) => c.key === "hero_background")?.imageUrl;

  async function fetchData() {
    try {
      const [eventsRes, announcementsRes, videosRes, testimonialsRes, contentRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/announcements"),
        fetch("/api/youtube/videos?maxResults=6"),
        fetch("/api/testimonials"),
        fetch("/api/site-content"),
      ]);

      const eventsData = await eventsRes.json();
      const announcementsData = await announcementsRes.json();
      const videosData = await videosRes.json();
      const testimonialsData = await testimonialsRes.json();
      const contentData = await contentRes.json();

      if (Array.isArray(eventsData)) setEvents(eventsData);
      else if (!eventsRes.ok) setEventsError(true);

      if (Array.isArray(announcementsData)) setAnnouncements(announcementsData);
      else if (!announcementsRes.ok) setAnnouncementsError(true);

      if (videosData.videos) setSermonVideos(videosData.videos);

      if (Array.isArray(testimonialsData)) setTestimonials(testimonialsData);

      if (Array.isArray(contentData)) setSiteContent(contentData);
    } catch {
      setEventsError(true);
      setAnnouncementsError(true);
    } finally {
      setEventsLoading(false);
      setAnnouncementsLoading(false);
      setVideosLoading(false);
      setTestimonialsLoading(false);
    }
  }

  function refetch() {
    setEventsLoading(true);
    setAnnouncementsLoading(true);
    setVideosLoading(true);
    setTestimonialsLoading(true);
    setEventsError(false);
    setAnnouncementsError(false);
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  const quickInfoContent = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickInfo
          icon={Clock}
          label="Sabbath Service"
          value="Saturdays at 11:00 AM"
          href="/visit"
        />
        <QuickInfo icon={MapPin} label="Location" value="Lilliput, Montego Bay" href="/visit" />
        <QuickInfo icon={Play} label="Livestream" value="Watch Online" href="/media" />
      </div>
    ),
    [],
  );

  const imageSrc = "/images/history/current_church_building_2016.jpg";

  const ministries = useMemo(
    () => [
      {
        name: "Youth Ministries",
        imageUrl: CHURCH_IMAGES.ministries.youth.worship,
        bgColor: "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)]",
        href: "/ministries",
      },
      {
        name: "Women's Ministry",
        imageUrl: CHURCH_IMAGES.ministries.womens.main,
        bgColor: "bg-gradient-to-br from-[var(--accent-wine)] to-[#561F30]",
        href: "/ministries",
      },
      {
        name: "Men's Ministry",
        imageUrl: CHURCH_IMAGES.ministries.mens.main,
        bgColor: "bg-gradient-to-br from-stone-600 to-stone-800",
        href: "/ministries",
      },
      {
        name: "Music Ministry",
        imageUrl: CHURCH_IMAGES.ministries.music.worship,
        bgColor: "bg-gradient-to-br from-[var(--primary)] to-[#CA8A04]",
        href: "/ministries",
      },
    ],
    [],
  );

  // Section nav — IDs must match the section element IDs below.
  const anchorItems = useMemo(
    () => [
      { id: "about", label: "About" },
      { id: "sermons", label: "Sermons" },
      { id: "this-week", label: "This Week" },
      { id: "ministries", label: "Ministries" },
      { id: "testimonies", label: "Voices" },
      { id: "visit", label: "Visit" },
    ],
    [],
  );

  return (
    <div className="min-h-screen">
      <HeroSection
        title={heroTitle || "Welcome to"}
        subtitle={heroSubtitle || "Lilliput SDA Church"}
        description={
          heroDescription ||
          "A warm, welcoming community in the heart of St. James, Jamaica. Join us as we grow together in faith, love, and service."
        }
        badge="Growing together in faith since 1974"
        badgeHref="/about"
        backgroundImage={heroImage || CHURCH_IMAGES.hero.churchBuilding}
        primaryAction={{ label: "Plan Your Visit", href: "/visit" }}
        secondaryAction={{ label: "Watch Online", href: "/media" }}
        quickInfo={quickInfoContent}
      />

      <AnchorPillNav items={anchorItems} offset={64} />

      <section id="about">
        <AboutSplit
          label="About Our Church"
          title="A Place to Belong, Believe, and Become"
          description="Founded in 1974, Lilliput SDA Church has been a beacon of hope and faith in the St. James community for over 50 years. Today we are a vibrant congregation of 463 members dedicated to sharing God's love through worship, fellowship, and service."
          additionalText="Whether you're a lifelong Adventist or just beginning your spiritual journey, there's a place for you here. Come experience the warmth of our church family."
          imageSrc={imageSrc}
          imageAlt="Church congregation"
          stats={{ value: "463", label: "Active Members", position: "bottom-left" }}
          action={{ label: "Learn Our Story", href: "/about" }}
        />
      </section>

      <section id="sermons" className="py-20 lg:py-28 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Latest Message"
            title="Recent Sermons"
            href="/media"
            linkText="View All"
          />
          <SermonList
            videos={sermonVideos}
            onVideoClick={setSelectedVideo}
            loading={videosLoading}
            maxItems={2}
          />
        </div>
      </section>

      {/* THIS WEEK — hidden when both lists are confirmed empty and not loading */}
      {(eventsLoading || announcementsLoading || eventsError || announcementsError ||
        events.length > 0 || announcements.length > 0) && (
      <section id="this-week" className="py-20 lg:py-28 bg-stone-50 dark:bg-stone-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="What's Happening"
              title="This Week at Lilliput"
              href="/events"
              linkText="Full Calendar"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)] dark:text-[var(--accent-lilac)] mb-4">
                  Upcoming Events
                </h3>
                <EventsList
                  events={events}
                  isLoading={eventsLoading}
                  isError={eventsError}
                  onRetry={refetch}
                />
              </div>
              <aside className="lg:col-span-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)] dark:text-[var(--accent-lilac)] mb-4">
                  Announcements
                </h3>
                <AnnouncementsList
                  announcements={announcements}
                  isLoading={announcementsLoading}
                  isError={announcementsError}
                  onRetry={refetch}
                />
              </aside>
            </div>
            {/* Note: Redundant Announcements sidebar was removed from here to fix Playwright strict mode violation */}
          </div>
      </section>
      )}

      <section id="ministries" className="py-20 lg:py-28 bg-white dark:bg-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <SectionHeader
              label="Get Involved"
              title="Our Ministries"
              className="justify-center text-center"
              align="center"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {ministries.map((ministry) => (
              <QuickMinistryCard key={ministry.name} {...ministry} />
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section
          id="testimonies"
          className="py-20 lg:py-28 bg-gradient-to-br from-[var(--primary)]/5 via-[var(--primary)]/3 to-[var(--accent-wine)]/5 dark:from-[var(--primary)]/10 dark:via-[var(--primary)]/5 dark:to-[var(--accent-wine)]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader label="Voices of Faith" title="Member Testimonies" />
            {testimonialsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-stone-800 rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/3 mb-4" />
                    <div className="h-20 bg-stone-200 dark:bg-stone-700 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.slice(0, 3).map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    name={testimonial.name}
                    role={testimonial.role || undefined}
                    memberSince={testimonial.memberSince || undefined}
                    content={testimonial.content}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section id="visit">
        <CTASection
          title="Ready to Visit?"
          description="We'd love to welcome you to Lilliput SDA Church. Whether you're looking for a church home or just visiting, you're welcome here."
          primaryAction={{
            label: "Plan a Visit",
            href: "/visit",
            variant: "primary",
          }}
          secondaryAction={{
            label: "Contact Us",
            href: "/contact",
            variant: "outline",
          }}
          backgroundColor="amber"
        />
      </section>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
}
