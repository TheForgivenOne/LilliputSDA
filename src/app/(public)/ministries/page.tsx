"use client";

import { useState, useEffect } from "react";
import { MinistryDetailCard } from "@/components/ui/Card";
import { CHURCH_IMAGES } from "@/lib/utils";
import { Users, Music, Heart, BookOpen, Star, Stethoscope, Hand, SlidersHorizontal, X } from "lucide-react";
import type { Ministry } from "@/types";
import { PageHero } from "@/components/sections/PageHero";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { FilterDrawer } from "@/components/ui/FilterDrawer";

const defaultMinistries = [
  {
    name: "Adventist Youth (AY)",
    description: "Our youth ministry provides a dynamic environment for young people to grow spiritually, develop leadership skills, and build lasting friendships through Bible study, social activities, and community service.",
    leader: "Sister Patricia Brown",
    meetingTime: "Saturdays at 4:30 PM",
    meetingLocation: "Fellowship Hall",
    imageUrl: CHURCH_IMAGES.ministries.youth.main,
    category: "youth" as const,
  },
  {
    name: "Pathfinders",
    description: "A worldwide organization for young people sponsored by the Seventh-day Adventist Church, focused on building character through outdoor activities, community service, and spiritual development.",
    leader: "Brother David Johnson",
    meetingTime: "Sundays at 2:00 PM",
    meetingLocation: "Church Grounds",
    imageUrl: CHURCH_IMAGES.ministries.pathfinders.main,
    category: "youth" as const,
  },
  {
    name: "Women's Ministry",
    description: "Empowering women to discover their potential in Christ through Bible study, prayer, fellowship, and outreach. We provide support for women at every stage of life.",
    leader: "Sister Angela Reid",
    meetingTime: "Wednesdays at 6:00 PM",
    meetingLocation: "Fellowship Hall",
    imageUrl: CHURCH_IMAGES.ministries.womens.main,
    category: "adult" as const,
  },
  {
    name: "Men's Ministry",
    description: "Building godly men through discipleship, accountability, and service. Our ministry focuses on spiritual growth, family leadership, and community impact.",
    leader: "Brother Michael Thompson",
    meetingTime: "Second Sabbath at 5:00 PM",
    meetingLocation: "Conference Room",
    imageUrl: CHURCH_IMAGES.ministries.mens.main,
    category: "adult" as const,
  },
  {
    name: "Music Ministry",
    description: "Our music ministry leads the congregation in worship through choir, instrumental music, and special musical presentations. We welcome musicians of all skill levels.",
    leader: "Sister Donna Miller",
    meetingTime: "Thursdays at 6:30 PM",
    meetingLocation: "Sanctuary",
    imageUrl: CHURCH_IMAGES.ministries.music.main,
    category: "music" as const,
  },
  {
    name: "Community Services",
    description: "Serving our local community through food distribution, clothing drives, health screenings, and various outreach programs. Join us in making a difference.",
    leader: "Sister Grace Thompson",
    meetingTime: "Second Sunday at 9:00 AM",
    meetingLocation: "Community Center",
    imageUrl: CHURCH_IMAGES.ministries.community.main,
    category: "adult" as const,
  },
  {
    name: "Health Ministry",
    description: "Promoting whole-person health through seminars, screenings, and wellness programs. We share God's message of health and wholeness through community health initiatives and lifestyle education.",
    leader: "Sister Patricia Gordon",
    meetingTime: "Third Saturday at 2:30 PM",
    meetingLocation: "Fellowship Hall",
    imageUrl: CHURCH_IMAGES.ministries.health.main,
    category: "adult" as const,
  },
  {
    name: "Personal Ministries",
    description: "Equipping members for personal witness and soul-winning. Through Bible studies, literature distribution, and visitation programs, we share Christ's love one-on-one with our community.",
    leader: "Brother Samuel Clarke",
    meetingTime: "Sundays at 10:00 AM",
    meetingLocation: "Conference Room",
    imageUrl: CHURCH_IMAGES.ministries.personal.main,
    category: "adult" as const,
  },
  {
    name: "Stewardship Ministry",
    description: "Teaching biblical principles of faithful stewardship of time, talents, and treasures. We help members understand God's ownership and our role as faithful managers.",
    leader: "Brother Howard Campbell",
    meetingTime: "First Sabbath at 2:30 PM",
    meetingLocation: "Conference Room",
    imageUrl: CHURCH_IMAGES.ministries.stewardship.main,
    category: "adult" as const,
  },
  {
    name: "Education Ministry",
    description: "Supporting academic excellence and Adventist education. We provide scholarships, tutoring, and resources to help our youth succeed in their educational journey.",
    leader: "Sister Marcia Wright",
    meetingTime: "Monthly Sabbath at 2:30 PM",
    meetingLocation: "Fellowship Hall",
    imageUrl: CHURCH_IMAGES.ministries.education.main,
    category: "family" as const,
  },
  {
    name: "Family Life Ministry",
    description: "Strengthening families through marriage enrichment, parenting seminars, and family fellowship events. We believe strong families build a strong church.",
    leader: "Pastor Lataniel Hamilton",
    meetingTime: "Quarterly at 2:30 PM",
    meetingLocation: "Sanctuary",
    imageUrl: CHURCH_IMAGES.ministries.family.main,
    category: "family" as const,
  },
  {
    name: "Children's Ministry",
    description: "Nurturing the spiritual growth of our children through Sabbath School, Vacation Bible School, and age-appropriate activities that teach God's love.",
    leader: "Sister Karen Daley",
    meetingTime: "Sabbath School at 9:30 AM",
    meetingLocation: "Children's Wing",
    imageUrl: CHURCH_IMAGES.ministries.children.main,
    category: "family" as const,
  },
  {
    name: "Communications Ministry",
    description: "Sharing the gospel through media, social media, and technology. Our team manages the website, live streaming, photography, and all church communications.",
    leader: "Brother Andre Johnson",
    meetingTime: "Monthly at 5:00 PM",
    meetingLocation: "Media Room",
    imageUrl: CHURCH_IMAGES.ministries.communications.main,
    category: "youth" as const,
  },
];

const ministryCategories = [
  { id: "all", label: "All Ministries", icon: Star },
  { id: "youth", label: "Youth", icon: Users },
  { id: "adult", label: "Adult", icon: Heart },
  { id: "family", label: "Family", icon: BookOpen },
  { id: "music", label: "Music", icon: Music },
  { id: "health", label: "Health", icon: Stethoscope },
  { id: "service", label: "Community", icon: Hand },
];

export default function MinistriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [ministriesLoading, setMinistriesLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeCategory = ministryCategories.find((c) => c.id === selectedCategory);

  useEffect(() => {
    async function fetchMinistries() {
      try {
        const res = await fetch("/api/ministries");
        const data = await res.json();
        if (Array.isArray(data)) setMinistries(data);
      } catch (err) {
        console.error("Failed to fetch ministries:", err);
      } finally {
        setMinistriesLoading(false);
      }
    }
    fetchMinistries();
  }, []);

  const displayMinistries = ministries.length > 0 ? ministries : defaultMinistries;

  const filteredMinistries = displayMinistries.filter((ministry: Ministry) =>
    selectedCategory === "all" ? true : ministry.category === selectedCategory
  );
  const filteredCount = filteredMinistries.length;

  return (
    <div className="min-h-screen">
      <PageHero
        badge={<span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 font-semibold text-sm backdrop-blur-sm"><span className="w-2 h-2 bg-[var(--accent-warm)] rounded-full animate-pulse" />Get Involved</span>}
        title="Our Ministries & Departments"
        description="Discover your place in our church family. We have departments for every age and interest, all focused on growing together in Christ."
        theme="amber"
      />

      {/* Filter strip — mobile: trigger + active chip / tablet+: inline pill row */}
      <section className="sticky top-16 lg:top-20 z-30 py-3 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border-subtle)] text-stone-700 dark:text-stone-200 font-medium text-sm shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            {selectedCategory !== "all" && activeCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-[var(--primary)] text-white text-sm font-medium shadow-md shadow-[rgba(234,179,8,0.25)]"
              >
                {activeCategory.label}
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="ml-auto text-sm text-stone-500 dark:text-stone-400">
              {ministriesLoading ? "…" : `${filteredCount} results`}
            </span>
          </div>
          {/* Tablet & desktop */}
          <div className="hidden md:block">
            <CategoryFilter
              categories={ministryCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      <FilterDrawer
        categories={ministryCategories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        itemNoun="ministries"
      />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {ministriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-video bg-stone-200 dark:bg-stone-700 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-2/3" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMinistries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMinistries.map((ministry: Ministry) => (
                <MinistryDetailCard
                  key={ministry.id || ministry.name}
                  name={ministry.name}
                  description={ministry.description || ""}
                  leader={ministry.leader}
                  meetingTime={ministry.meetingTime}
                  meetingLocation={ministry.meetingLocation}
                  imageUrl={ministry.imageUrl}
                  category={ministry.category}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
                No ministries found
              </h3>
              <p className="text-stone-500 dark:text-stone-400">
                No ministries available in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-stone-100 to-stone-50 dark:from-stone-800 dark:to-stone-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-stone-900 dark:text-stone-100 mb-6 font-[family-name:var(--font-playfair)]">
            Ready to Get Involved?
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-300 mb-10 max-w-2xl mx-auto">
            We believe everyone has unique gifts to share. Whether you&apos;re 
            passionate about working with youth, music, community service, or 
            supporting families, there&apos;s a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:lhamilton@westjamaica.org"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-semibold shadow-lg shadow-[rgba(234,179,8,0.30)] hover:bg-[var(--primary-hover)] hover:shadow-[rgba(234,179,8,0.45)] hover:-translate-y-0.5 transition-all"
            >
              Contact a Ministry Leader
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/contact?topic=volunteer#form"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 rounded-2xl font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] dark:hover:border-[var(--accent-lilac)] dark:hover:text-[var(--accent-lilac)] transition-all"
            >
              General Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
