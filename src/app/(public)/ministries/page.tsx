"use client";

import { useState } from "react";
import { MinistryDetailCard } from "@/components/ui/Card";
import { CHURCH_IMAGES } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users, Music, Heart, BookOpen, Star } from "lucide-react";
import type { Ministry } from "@/types";
import { PageHero } from "@/components/sections/PageHero";
import { CategoryFilter } from "@/components/ui/CategoryFilter";

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
];

const ministryCategories = [
  { id: "all", label: "All Ministries", icon: Star },
  { id: "youth", label: "Youth", icon: Users },
  { id: "adult", label: "Adult", icon: Heart },
  { id: "family", label: "Family", icon: BookOpen },
  { id: "music", label: "Music", icon: Music },
];

export default function MinistriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const ministries = useQuery(api.ministries.queries.listAll);
  const ministriesLoading = ministries === undefined;

  const displayMinistries = ministries && ministries.length > 0 ? ministries : defaultMinistries;
  
  const filteredMinistries = displayMinistries.filter((ministry: Ministry) =>
    selectedCategory === "all" ? true : ministry.category === selectedCategory
  );

  return (
    <div className="min-h-screen">
      <PageHero
        badge="Get Involved"
        title="Our Ministries"
        description="Discover your place in our church family. We have ministries for every age and interest, all focused on growing together in Christ."
        theme="amber"
      />

      {/* Ministry Categories */}
      <section className="py-8 bg-stone-100 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            categories={ministryCategories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {ministriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-md">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMinistries.map((ministry: Ministry) => (
                <MinistryDetailCard
                  key={ministry._id || ministry.name}
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

      {/* Get Involved CTA */}
      <section className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Ready to Get Involved?
          </h2>
          <p className="text-stone-600 dark:text-stone-300 mb-8 max-w-2xl mx-auto">
            We believe everyone has unique gifts to share. Whether you&apos;re 
            passionate about working with youth, music, community service, or 
            supporting families, there&apos;s a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:lhamilton@westjamaica.org"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
            >
              Contact a Ministry Leader
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-lg font-medium hover:border-amber-700 hover:text-amber-700 transition-colors"
            >
              General Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
