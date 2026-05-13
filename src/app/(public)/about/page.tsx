"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Heart, Church, Sparkles, Shield, Crown,
  Flame, Cross, Hand, TreePine, Star, UsersRound,
  Droplets, Wine, Gift, ScrollText, Scale, Sun, Wallet,
  Leaf, Home, Tent, Cloud, Sunrise, Mountain, Globe,
} from "lucide-react";
import { CHURCH_IMAGES } from "@/lib/utils";
import { CHURCH_EMAIL } from "@/lib/config";
import { StaffCard } from "@/components/ui/Card";
import { LeaderCard, LeaderCardGroup } from "@/components/cards/LeaderCard";
import { HistoricalSlideshow } from "@/components/cards/HistoricalSlideshow";
import { PageHero } from "@/components/sections/PageHero";
import { Timeline } from "@/components/sections/Timeline";

type SiteContent = {
  key: string;
  content: string | null;
  imageUrl: string | null;
};
import { MissionVision } from "@/components/sections/MissionVision";
import { BeliefGrid } from "@/components/cards/BeliefCard";
import { PageStats } from "@/components/sections/PageStats";
import type { StaffMember } from "@/types";

const milestones = [
  { year: "1974", title: "Foundation", description: "Brother George Heavens and Miss Catherine Morrison initiated the work in Lilliput District. First Sunday School held at Mr. Lawrence Lee's home." },
  { year: "1975", title: "First Building", description: "First zinc church structure built by the roadside with foundation members including Sister Thelma Lee and Brother Renford McIntosh." },
  { year: "1985", title: "Church Organized", description: "Church officially organized with 400 members after a crusade by Pastor Oliphant." },
  { year: "1988", title: "Hurricane Gilbert", description: "Hurricane Gilbert destroys the building. Church rebuilt with canvas and continued serving the community." },
  { year: "1993", title: "Relocation", description: "Relocated to current site after being forced out by Urban Development Corporation." },
  { year: "2026", title: "52 Years of Faith", description: "Celebrating 52 years of ministry with 463 members, 5 churches in the Lilliput District, and continued community impact." },
];

const beliefs = [
  { icon: BookOpen, title: "The Holy Scriptures", description: "The Holy Scriptures, Old and New Testaments, are the written Word of God, given by divine inspiration." },
  { icon: Heart, title: "The Trinity", description: "There is one God: Father, Son, and Holy Spirit, a unity of three co-eternal Persons." },
  { icon: Crown, title: "The Father", description: "God the eternal Father is the Creator, Source, Sustainer, and Sovereign of all creation." },
  { icon: Sparkles, title: "The Son", description: "God the eternal Son became incarnate in Jesus Christ. Through Him all things were created." },
  { icon: Flame, title: "The Holy Spirit", description: "God the eternal Spirit was active with the Father and the Son in Creation, incarnation, and redemption." },
  { icon: TreePine, title: "Creation", description: "God has revealed in Scripture the authentic and historical account of His creative activity." },
  { icon: Shield, title: "The Nature of Humanity", description: "Man and woman were made in the image of God with individuality, the power and freedom to think and to do." },
  { icon: Cross, title: "The Great Controversy", description: "All humanity is now involved in a great controversy between Christ and Satan." },
  { icon: Star, title: "Life, Death & Resurrection", description: "In Christ's life of perfect obedience, His suffering, death, and resurrection, God provided the only means of atonement." },
  { icon: Hand, title: "The Experience of Salvation", description: "In infinite love and mercy God made Christ to be sin for us, so that in Him we might be made the righteousness of God." },
  { icon: TreePine, title: "Growing in Christ", description: "By His death on the cross Jesus triumphed over the forces of evil, giving us victory over evil forces." },
  { icon: Church, title: "The Church", description: "The church is the community of believers who confess Jesus Christ as Lord and Saviour." },
  { icon: UsersRound, title: "The Remnant", description: "In the last days, a remnant has been called out to keep the commandments of God and the faith of Jesus." },
  { icon: Globe, title: "Unity in the Body", description: "The church is one body with many members, called from every nation, kindred, tongue, and people." },
  { icon: Droplets, title: "Baptism", description: "By baptism we confess our faith in the death and resurrection of Jesus Christ." },
  { icon: Wine, title: "The Lord's Supper", description: "The Lord's Supper is a participation in the emblems of the body and blood of Jesus as an expression of faith in Him." },
  { icon: Gift, title: "Spiritual Gifts", description: "God bestows upon all members of His church in every age spiritual gifts for loving ministry." },
  { icon: ScrollText, title: "The Gift of Prophecy", description: "The Scriptures testify that one of the gifts of the Holy Spirit is prophecy, manifested in the ministry of Ellen G. White." },
  { icon: Scale, title: "The Law of God", description: "The great principles of God's law are embodied in the Ten Commandments and exemplified in the life of Christ." },
  { icon: Sun, title: "The Sabbath", description: "The gracious Creator, after the six days of Creation, rested on the seventh day and instituted the Sabbath." },
  { icon: Wallet, title: "Stewardship", description: "We are God's stewards, entrusted by Him with time, opportunities, abilities, and possessions." },
  { icon: Leaf, title: "Christian Behavior", description: "We are called to be a godly people who think, feel, and act in harmony with biblical principles." },
  { icon: Home, title: "Marriage & the Family", description: "Marriage was divinely established in Eden and affirmed by Jesus to be a lifelong union between a man and a woman." },
  { icon: Tent, title: "Heavenly Sanctuary", description: "There is a sanctuary in heaven, the true tabernacle, in which Christ ministers on our behalf." },
  { icon: Cloud, title: "The Second Coming", description: "The second coming of Christ is the blessed hope of the church, the grand climax of the gospel." },
  { icon: Sunrise, title: "Death & Resurrection", description: "The wages of sin is death. But God will grant eternal life to His redeemed." },
  { icon: Mountain, title: "The Millennium", description: "The millennium is the thousand-year reign of Christ with His saints in heaven." },
  { icon: Globe, title: "The New Earth", description: "On the new earth, God will provide an eternal home for the redeemed and a perfect environment for everlasting life." },
];

const defaultPastor = {
  name: "Pastor Lataniel Hamilton",
  role: "Junior Pastor",
  title: "Junior Pastor, Lilliput SDA Church",
  bio: "Pastor Hamilton leads the Lilliput SDA Church with a passion for community outreach and spiritual growth. Under his leadership, the church has seen continued growth and expanded ministry programs.",
  photoUrl: "",
  email: CHURCH_EMAIL,
  phone: "",
  department: "Pastoral",
};

export default function AboutPage() {
  const [visibleCount, setVisibleCount] = useState(8);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);

  const aboutTitle = siteContent.find(c => c.key === "about_title")?.content;
  const aboutDescription = siteContent.find(c => c.key === "about_description")?.content;
  const aboutImage = siteContent.find(c => c.key === "about_image")?.imageUrl;

  useEffect(() => {
    async function fetchData() {
      try {
        const [staffRes, contentRes] = await Promise.all([
          fetch("/api/staff"),
          fetch("/api/site-content"),
        ]);
        const staffData = await staffRes.json();
        const contentData = await contentRes.json();
        if (staffData.staff) setStaff(staffData.staff);
        if (Array.isArray(contentData)) setSiteContent(contentData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setStaffLoading(false);
      }
    }
    fetchData();
  }, []);

  const pastoralStaff = staff.filter((s) => s.department === "Pastoral");
  const churchBoard = staff.filter((s) => s.department === "Leadership");
  const departmentHeads = staff.filter((s) => s.department !== "Pastoral" && s.department !== "Leadership");

  return (
    <div className="min-h-screen">
      <PageHero
        title={aboutTitle || "Growing Together in Faith Since 1974"}
        description={aboutDescription || "For over 52 years, Lilliput SDA Church has been a beacon of hope and faith in the St. James community, serving God and our neighbors with love."}
        badge={<span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-stone-300 font-semibold text-sm backdrop-blur-sm"><span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />Our Story</span>}
        backgroundImage={aboutImage || CHURCH_IMAGES.history.oldSite[0].src}
        theme="stone"
      />

      <section className="py-20 lg:py-28 bg-white dark:bg-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold mb-6">
                Our Journey
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-stone-900 dark:text-stone-100 mb-8 font-[family-name:var(--font-playfair)]">
                Our History
              </h2>
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  The Lilliput Seventh-day Adventist Church story began in 1974 through a divine 
                  conversation between Brother George Heavens and Miss Catherine Morrison. What 
                  started as a small Sunday School gathering in Mr. Lawrence Lee&apos;s home has 
                  grown into a vibrant congregation of 463 members.
                </p>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                  Through trials and triumphs—including surviving Hurricane Gilbert in 1988 and 
                  relocating to our current site in 1993—our faith has remained steadfast. Today, 
                  we continue the legacy of our founding pioneers: Sister Thelma Lee, Sister Leslie, 
                  Brother Heavens, and Brother Renford McIntosh.
                </p>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  Under the leadership of Pastor Lataniel Hamilton and the West Jamaica Conference, 
                  we have expanded our ministry across the Lilliput District and community outreach 
                  programs that touch lives throughout St. James.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <HistoricalSlideshow slides={CHURCH_IMAGES.history.oldSite} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Timeline milestones={milestones} visibleCount={visibleCount} />

      <MissionVision
        mission={{
          title: "Our Mission",
          content: "To proclaim the everlasting gospel of Jesus Christ to all people, nurturing believers in their faith journey, and preparing them for His soon return through worship, fellowship, education, and service."
        }}
        vision={{
          title: "Our Vision",
          content: "To be a Christ-centered community that transforms lives through the power of the Holy Spirit, equipping believers to share God's love and hope with the world, starting with our local community in St. James."
        }}
      />

      <section id="beliefs" className="py-20 lg:py-28 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold mb-6">
              Fundamentals of Faith
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 dark:text-stone-100 mb-6 font-[family-name:var(--font-playfair)]">
              What We Believe
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-lg">
              As Seventh-day Adventists, we uphold the fundamental beliefs of the 
              worldwide church, rooted in Scripture and focused on Jesus Christ.
            </p>
          </div>

          <BeliefGrid
            beliefs={beliefs}
            visibleCount={visibleCount}
            onShowMore={() => setVisibleCount(visibleCount >= beliefs.length ? 8 : beliefs.length)}
          />

          <div className="text-center mt-10">
            <p className="text-stone-500 dark:text-stone-400">
              To learn more about our 28 fundamental beliefs, visit{" "}
              <a
                href="https://www.adventist.org/beliefs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
              >
                adventist.org/beliefs
              </a>
            </p>
          </div>
        </div>
      </section>

      <section id="leadership" className="py-20 lg:py-28 bg-white dark:bg-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold mb-6">
              Pastoral Team
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 dark:text-stone-100 mb-6 font-[family-name:var(--font-playfair)]">
              Our Pastor
            </h2>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto text-lg">
              Leading with vision, compassion, and a heart for God&apos;s people.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            {staffLoading ? (
              <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 animate-pulse border border-stone-100 dark:border-stone-700">
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
                <StaffCard key={person.id} {...person} />
              ))
            ) : (
              <StaffCard {...defaultPastor} />
            )}
          </div>

          <LeaderCardGroup
            title="Church Board"
            description="Our church board provides spiritual oversight and guidance for the congregation."
          >
            {staffLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="w-32 h-40 bg-stone-200 dark:bg-stone-700 rounded-2xl animate-pulse" />
              ))
            ) : churchBoard.length > 0 ? (
              churchBoard.map((person: StaffMember) => (
                <LeaderCard
                  key={person.id}
                  name={person.name}
                  role={person.role}
                  title={person.title}
                  photoUrl={person.photoUrl}
                  email={person.email}
                />
              ))
            ) : (
              <p className="text-stone-500 dark:text-stone-400 text-sm col-span-full text-center py-4">
                No board members listed at this time.
              </p>
            )}
          </LeaderCardGroup>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeaderCardGroup
            title="Department Heads"
            description="Dedicated leaders who coordinate our various ministries and programs."
          >
            {staffLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="w-32 h-40 bg-stone-200 dark:bg-stone-700 rounded-2xl animate-pulse" />
              ))
            ) : departmentHeads.length > 0 ? (
              departmentHeads.map((person: StaffMember) => (
                <LeaderCard
                  key={person.id}
                  name={person.name}
                  role={person.role}
                  title={person.title}
                  photoUrl={person.photoUrl}
                  email={person.email}
                />
              ))
            ) : (
              <p className="text-stone-500 dark:text-stone-400 text-sm col-span-full text-center py-4">
                No department leaders listed at this time.
              </p>
            )}
          </LeaderCardGroup>
        </div>
      </section>

      <PageStats
        stats={[
          { number: "52+", label: "Years of Ministry" },
          { number: "463", label: "Active Members" },
          { number: "5", label: "Churches in Lilliput District" },
          { number: "10+", label: "Active Ministries" },
        ]}
      />
    </div>
  );
}
