"use client";

import { useState, useEffect } from "react";
import { Search, Play, Tv, Calendar, History } from "lucide-react";
import { Input } from "@/components/ui/Input";
import {
  VideoCard,
  FeaturedVideo,
  VideoModal,
  VideoGridSkeleton,
  FeaturedVideoSkeleton,
  VideoError,
} from "@/components/media";
import type { YouTubeVideo } from "@/types";

type FilterTab = "all" | "live" | "upcoming" | "past";

const youtubeChannelUrl = "https://youtube.com/@lilliputsdamedia";

const tabs: { key: FilterTab; label: string; icon: typeof Play }[] = [
  { key: "all", label: "All", icon: Tv },
  { key: "live", label: "Live", icon: Play },
  { key: "upcoming", label: "Upcoming", icon: Calendar },
  { key: "past", label: "Past", icon: History },
];

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [liveCount, setLiveCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        const response = await fetch("/api/youtube/videos?maxResults=50");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch videos");
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setVideos([]);
        } else if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
          setLiveCount(data.liveCount ?? 0);
          setUpcomingCount(data.upcomingCount ?? 0);
          setError(null);
        } else {
          setError("No videos found");
          setVideos([]);
        }
      } catch (err) {
        console.warn("Failed to load videos:", err);
        setError(err instanceof Error ? err.message : "Failed to load videos");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    if (activeTab !== "all" && video.status !== activeTab) return false;

    const matchesSearch = searchQuery
      ? video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });

  const featuredVideo = videos.find((v) => v.status === "live") ||
    videos.find((v) => v.status === "upcoming") ||
    videos[0];

  const tabCounts: Record<FilterTab, number> = {
    all: videos.length,
    live: liveCount,
    upcoming: upcomingCount,
    past: videos.length - liveCount - upcomingCount,
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white pt-20 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full text-amber-300 text-sm font-semibold mb-6 backdrop-blur-sm">
              <Play className="w-4 h-4" />
              Watch & Listen
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-[1.05] font-[family-name:var(--font-playfair)] tracking-tight">
              Sermons & Media
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed font-light">
              Catch up on past messages or listen again to your favorites.
              All sermons are available on our YouTube channel.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-stone-50 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6 font-[family-name:var(--font-playfair)]">
            {liveCount > 0 ? "Now Streaming" : upcomingCount > 0 ? "Upcoming" : "Latest Message"}
          </h2>

          {loading ? (
            <FeaturedVideoSkeleton />
          ) : error ? (
            <VideoError error={error} channelUrl={youtubeChannelUrl} />
          ) : featuredVideo ? (
            <FeaturedVideo
              video={featuredVideo}
              isPlaying={selectedVideo?.id === featuredVideo.id}
              onPlay={() => setSelectedVideo(featuredVideo)}
            />
          ) : null}
        </div>
      </section>

      <section className="py-8 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = tabCounts[tab.key];
              const isActive = activeTab === tab.key;
              const isLiveTab = tab.key === "live" && liveCount > 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 shadow-sm"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                  } ${isLiveTab ? "!text-red-600 dark:!text-red-400" : ""}`}
                >
                  {isLiveTab && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                    </span>
                  )}
                  {!isLiveTab && <Icon className="w-4 h-4" />}
                  {tab.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-amber-200/70 text-amber-700 dark:bg-amber-800/50 dark:text-amber-300"
                        : "bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-400"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <VideoGridSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-stone-500 dark:text-stone-400">{error}</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-500 dark:text-stone-400">
                {searchQuery
                  ? "No videos match your search"
                  : activeTab === "live"
                  ? "No live streams right now"
                  : activeTab === "upcoming"
                  ? "No upcoming streams scheduled"
                  : "No videos found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={setSelectedVideo}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-amber-600 via-amber-700 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 font-[family-name:var(--font-playfair)]">
            Subscribe on YouTube
          </h2>
          <p className="text-amber-100 text-lg mb-10 max-w-2xl mx-auto">
            Never miss a sermon! Subscribe to our YouTube channel to get notified
            when new messages are uploaded.
          </p>
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-amber-700 rounded-2xl font-semibold hover:bg-stone-100 transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Visit Our Channel
          </a>
        </div>
      </section>

      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
