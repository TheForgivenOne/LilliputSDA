"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistorySlide {
  src: string;
  alt: string;
  caption: string;
  year: string;
}

interface HistoricalSlideshowProps {
  slides: readonly HistorySlide[];
  autoPlayInterval?: number;
}

export function HistoricalSlideshow({
  slides,
  autoPlayInterval = 5000,
}: HistoricalSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [slideOffset, setSlideOffset] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const togglePlay = () => {
    setIsPaused((prev) => !prev);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    if (isPaused || slides.length <= 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const step = 50;
    const increment = (100 / autoPlayInterval) * step;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, step);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, autoPlayInterval, nextSlide, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === " ") togglePlay();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    const diff = touchStart - currentX;
    setSlideOffset(diff);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setSlideOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setIsDragging(false);
    setSlideOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Image
        src={currentSlide.src}
        alt={currentSlide.alt}
        fill
        sizes="100vw"
        className={cn(
          "object-cover transition-transform duration-700 ease-out",
          isDragging && "transition-none"
        )}
        style={{
          transform: `scale(${1 + progress * 0.0003}) translateX(${slideOffset}px)`,
        }}
        priority
        draggable={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        {currentSlide.year && (
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
            <Calendar className="w-4 h-4" />
            <span>{currentSlide.year}</span>
            <span className="text-xs text-white/60">(Archive Photo)</span>
          </div>
        )}
        <p className="text-lg font-medium">{currentSlide.caption}</p>
        <p className="text-sm text-white/70 mt-1">{currentSlide.alt}</p>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all",
              "opacity-0 group-hover:opacity-100 lg:opacity-0"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all",
              "opacity-0 group-hover:opacity-100 lg:opacity-0"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={togglePlay}
            className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? (
              <Play className="w-4 h-4 text-white" />
            ) : (
              <Pause className="w-4 h-4 text-white" />
            )}
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex gap-2 items-center">
            <div className="flex-1 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all flex-1 touch-manipulation",
                    index === currentIndex
                      ? "bg-white"
                      : "bg-white/30 hover:bg-white/50"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <span className="text-xs text-white/60 ml-2">
              {currentIndex + 1}/{slides.length}
            </span>
          </div>

          {slides.length > 1 && !isPaused && (
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-none"
              style={{ width: `${progress}%` }}
            />
          )}
        </>
      )}
    </div>
  );
}
