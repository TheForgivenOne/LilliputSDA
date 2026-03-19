"use client";

import Image from "next/image";
import { Church, Users, Heart, BookOpen } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CHURCH_IMAGES } from "@/lib/utils";
import { StaffCard } from "@/components/ui/Card";
import { LeaderCard, LeaderCardGroup } from "@/components/features/LeaderCard";
import type { StaffMember } from "@/types";

const milestones = [
  { year: "1974", title: "Foundation", description: "Brother George Heavens and Miss Catherine Morrison initiate the work in Lilliput District. First Sunday School held at Mr. Lawrence Lee's home." },
  { year: "1975", title: "First Building", description: "First zinc church structure built by the roadside with foundation members including Sister Thelma Lee and Brother Renford McIntosh." },
  { year: "1985", title: "Church Organized", description: "Church officially organized with 400 members after crusade by Pastor Oliphant." },
  { year: "1988", title: "Hurricane Gilbert", description: "Hurricane Gilbert destroys the building. Church rebuilt with canvas and continued serving the community." },
  { year: "1993", title: "Relocation", description: "Relocated to current site after being forced out by Urban Development Corporation." },
  { year: "2026", title: "52 Years of Faith", description: "Celebrating 52 years of ministry with over 700 active members, multiple daughter churches, and continued community impact." },
];

const beliefs = [
  { icon: BookOpen, title: "The Bible", description: "We believe the Bible is the inspired Word of God and our only creed." },
  { icon: Heart, title: "The Trinity", description: "We believe in one God: Father, Son, and Holy Spirit, a unity of three co-eternal Persons." },
  { icon: Church, title: "The Church", description: "We believe the church is the community of believers who confess Jesus Christ as Lord and Saviour." },
  { icon: Users, title: "Second Coming", description: "We believe in the second coming of Christ, which will be literal, personal, and visible." },
];

const defaultPastor = {
  name: "Pastor Lataniel Hamilton",
  role: "Senior Pastor",
  title: "District Pastor, Lilliput District of Churches",
  bio: "Pastor Hamilton leads the Lilliput District of Churches with a passion for community outreach and spiritual growth. Under his leadership, the district has seen continued growth and expanded ministry programs.",
  photoUrl: CHURCH_IMAGES.staff.pastor,
  email: "lhamilton@westjamaica.org",
  phone: "(876) 123-4567",
  department: "Pastoral",
};

export default function AboutPage() {
  const staff = useQuery(api.staff.listAll);
  const staffLoading = staff === undefined;

  const pastoralStaff = staff?.filter((s: StaffMember) => s.department === "Pastoral") || [];
  const churchBoard = staff?.filter((s: StaffMember) => s.department === "Leadership") || [];
  const departmentHeads = staff?.filter((s: StaffMember) => s.department !== "Pastoral" && s.department !== "Leadership") || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-stone-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={CHURCH_IMAGES.history.vintage}
            alt="Church history"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-400 font-medium mb-4 block">Our Story</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Growing Together in Faith Since 1974
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed">
              For over 52 years, Lilliput SDA Church has been a beacon of hope and faith 
              in the St. James community, serving God and our neighbors with love.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                Our History
              </h2>
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  The Lilliput Seventh-day Adventist Church story began in 1974 through a divine 
                  conversation between Brother George Heavens and Miss Catherine Morrison. What 
                  started as a small Sunday School gathering in Mr. Lawrence Lee&apos;s home has 
                  grown into a vibrant congregation of over 700 members.
                </p>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  Through trials and triumphs—including surviving Hurricane Gilbert in 1988 and 
                  relocating to our current site in 1993—our faith has remained steadfast. Today, 
                  we continue the legacy of our founding pioneers: Sister Thelma Lee, Sister Leslie, 
                  Brother Heavens, and Brother Renford McIntosh.
                </p>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  Under the leadership of Pastor Lataniel Hamilton and the West Jamaica Conference, 
                  we have expanded our ministry to include daughter churches and community outreach 
                  programs that touch lives throughout St. James.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={CHURCH_IMAGES.congregation.gathering}
                  alt="Church historical photos"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Key Milestones
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              A journey of faith spanning five decades of ministry and service.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200 dark:bg-amber-900/50" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
                      <span className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-2 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-stone-600 dark:text-stone-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 bg-amber-700 rounded-full border-4 border-stone-100 dark:border-stone-800 z-10 flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {milestone.year.slice(-2)}
                    </span>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-amber-700 dark:bg-amber-800 text-white p-8 lg:p-12 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-amber-100 text-lg leading-relaxed">
                To proclaim the everlasting gospel of Jesus Christ to all people, 
                nurturing believers in their faith journey, and preparing them for 
                His soon return through worship, fellowship, education, and service.
              </p>
            </div>
            <div className="bg-stone-800 dark:bg-stone-900 text-white p-8 lg:p-12 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-stone-300 text-lg leading-relaxed">
                To be a Christ-centered community that transforms lives through the 
                power of the Holy Spirit, equipping believers to share God&apos;s love 
                and hope with the world, starting with our local community in St. James.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section id="beliefs" className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-700 dark:text-amber-400 font-medium mb-2 block">
              Fundamentals of Faith
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              What We Believe
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              As Seventh-day Adventists, we uphold the fundamental beliefs of the 
              worldwide church, rooted in Scripture and focused on Jesus Christ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beliefs.map((belief) => (
              <div
                key={belief.title}
                className="p-6 rounded-2xl border border-stone-100 dark:border-stone-700 bg-white dark:bg-stone-800/50"
              >
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
                  <belief.icon className="w-6 h-6 text-amber-700 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  {belief.title}
                </h3>
                <p className="text-stone-600 dark:text-stone-300 text-sm">
                  {belief.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-stone-500 dark:text-stone-400">
              To learn more about our 28 fundamental beliefs, visit{" "}
              <a
                href="https://www.adventist.org/beliefs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 dark:text-amber-400 hover:underline"
              >
                adventist.org/beliefs
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pastor Section */}
          <div className="text-center mb-12">
            <span className="text-amber-700 dark:text-amber-400 font-medium mb-2 block">
              Pastoral Team
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Our Pastor
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
              Leading with vision, compassion, and a heart for God&apos;s people.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            {staffLoading ? (
              <div className="bg-white dark:bg-stone-800 rounded-xl p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-40 h-40 bg-stone-200 dark:bg-stone-700 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-1/2" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/3" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ) : pastoralStaff.length > 0 ? (
              pastoralStaff.map((person: StaffMember) => (
                <StaffCard key={person._id} {...person} />
              ))
            ) : (
              <StaffCard {...defaultPastor} />
            )}
          </div>

          {/* Church Board Section */}
          <LeaderCardGroup
            title="Church Board"
            description="Our church board provides spiritual oversight and guidance for the congregation."
          >
            {staffLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="w-32 h-40 bg-stone-200 dark:bg-stone-700 rounded-xl animate-pulse" />
              ))
            ) : churchBoard.length > 0 ? (
              churchBoard.map((person: StaffMember) => (
                <LeaderCard
                  key={person._id}
                  name={person.name}
                  role={person.role}
                  title={person.title}
                  photoUrl={person.photoUrl}
                  email={person.email}
                />
              ))
            ) : (
              <p className="text-stone-500 dark:text-stone-400 col-span-full text-center py-4">
                Church board information coming soon.
              </p>
            )}
          </LeaderCardGroup>
        </div>
      </section>

      {/* Department Heads Section */}
      <section className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeaderCardGroup
            title="Department Heads"
            description="Dedicated leaders who coordinate our various ministries and programs."
          >
            {staffLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="w-32 h-40 bg-stone-200 dark:bg-stone-700 rounded-xl animate-pulse" />
              ))
            ) : departmentHeads.length > 0 ? (
              departmentHeads.map((person: StaffMember) => (
                <LeaderCard
                  key={person._id}
                  name={person.name}
                  role={person.role}
                  title={person.title}
                  photoUrl={person.photoUrl}
                  email={person.email}
                />
              ))
            ) : (
              <p className="text-stone-500 dark:text-stone-400 col-span-full text-center py-4">
                Department head information coming soon.
              </p>
            )}
          </LeaderCardGroup>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "52+", label: "Years of Ministry" },
              { number: "700+", label: "Active Members" },
              { number: "5", label: "Daughter Churches" },
              { number: "10+", label: "Active Ministries" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-amber-700 dark:text-amber-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-stone-600 dark:text-stone-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
