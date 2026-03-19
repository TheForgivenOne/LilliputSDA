"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { decodeHtmlEntities } from "@/lib/utils";
import type { YouTubeVideo } from "@/types";

// YouTube channel base URL
const youtubeChannelUrl = "https://youtube.com/@lilliputsdamedia";

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        const response = await fetch("/api/youtube/videos?maxResults=12");
        
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
          setError(null);
        } else {
          setError("No videos found");
          setVideos([]);
        }
      } catch (err) {
        console.error("Failed to load videos:", err);
        setError(err instanceof Error ? err.message : "Failed to load videos");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  // Filter videos based on search query
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Get the latest video for featured section
  const latestVideo = videos[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-400 font-medium mb-4 block">
              Watch & Listen
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sermons & Media
            </h1>
            <p className="text-xl text-stone-300 leading-relaxed">
              Catch up on past messages or listen again to your favorites. 
              All sermons are available on our YouTube channel.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className="py-12 bg-stone-100 dark:bg-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
            Latest Message
          </h2>
          
          {loading ? (
            <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto bg-stone-200 dark:bg-stone-700 animate-pulse" />
                <div className="p-8 lg:p-12 space-y-4">
                  <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-24 animate-pulse" />
                  <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-full animate-pulse" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-stone-800 rounded-2xl p-8 text-center">
              <p className="text-stone-500 dark:text-stone-400 mb-4">{error}</p>
              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors"
              >
                <Play className="w-5 h-5" />
                Visit YouTube Channel
              </a>
            </div>
          ) : latestVideo ? (
            <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto relative bg-stone-900">
                  <Image
                    src={latestVideo.thumbnailUrl}
                    alt={decodeHtmlEntities(latestVideo.title)}
                    fill
                    className="object-cover"
                    onError={() => {}}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                      <a
                        href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                      <div className="w-20 h-20 rounded-full bg-amber-600 flex items-center justify-center group-hover:bg-amber-500 transition-colors shadow-lg">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </a>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/75 text-white text-sm px-3 py-1 rounded">
                    {latestVideo.duration}
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="text-amber-700 dark:text-amber-400 font-medium mb-2">
                    {new Date(latestVideo.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                    {decodeHtmlEntities(latestVideo.title)}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-300 mb-4 line-clamp-3">
                    {decodeHtmlEntities(latestVideo.description)}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-stone-500 dark:text-stone-400 mb-6">
                    <span className="flex items-center gap-1">
                      {parseInt(latestVideo.viewCount).toLocaleString()} views
                    </span>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors w-fit"
                  >
                    <Play className="w-5 h-5" />
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Search */}
      <section className="py-8 border-b border-stone-200 dark:border-stone-800">
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

      {/* Videos Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-md">
                  <div className="aspect-video bg-stone-200 dark:bg-stone-700 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-stone-500 dark:text-stone-400">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-video relative bg-stone-900">
                      <Image
                        src={video.thumbnailUrl}
                        alt={decodeHtmlEntities(video.title)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        onError={() => {}}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-amber-600/90 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1 line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        {decodeHtmlEntities(video.title)}
                      </h3>
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {filteredVideos.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-stone-500 dark:text-stone-400">
                    No videos found matching your criteria.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* YouTube Channel CTA */}
      <section className="py-16 lg:py-24 bg-amber-700 dark:bg-amber-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe on YouTube
          </h2>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
            Never miss a sermon! Subscribe to our YouTube channel to get notified 
            when new messages are uploaded.
          </p>
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-700 rounded-lg font-medium hover:bg-stone-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Visit Our Channel
          </a>
        </div>
      </section>
    </div>
  );
}
