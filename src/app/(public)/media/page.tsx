"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
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

// YouTube channel base URL
const youtubeChannelUrl = "https://youtube.com/@lilliputsdamedia";

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

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
            <FeaturedVideoSkeleton />
          ) : error ? (
            <VideoError error={error} channelUrl={youtubeChannelUrl} />
          ) : latestVideo ? (
            <FeaturedVideo
              video={latestVideo}
              isPlaying={selectedVideo?.id === latestVideo.id}
              onPlay={() => setSelectedVideo(latestVideo)}
            />
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
            <VideoGridSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-stone-500 dark:text-stone-400">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={setSelectedVideo}
                  />
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

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
