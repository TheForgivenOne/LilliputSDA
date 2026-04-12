/**
 * Church Image Configuration
 * 
 * This file contains placeholder images from Unsplash for the Lilliput SDA Church website.
 * These are free to use under the Unsplash License.
 * 
 * When real church photos become available, replace these URLs with actual church images.
 * 
 * Image Sources:
 * - Unsplash (https://unsplash.com/license) - Free license
 * 
 * For production, consider:
 * - Cloudinary (https://cloudinary.com) - Free tier with optimization
 * - Vercel Blob (https://vercel.com/storage/blob) - Built-in with deployment
 * - Upload directly to CMS when EditableImage is implemented
 */

export const CHURCH_IMAGES = {
  /**
   * Hero & Background Images
   */
  hero: {
    churchBuilding: "/images/logos/current-church.png",
    churchExterior: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1920&h=600&fit=crop&auto=format&q=80",
  },

  /**
   * Congregation & Worship Images
   */
  congregation: {
    main: "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&h=600&fit=crop&auto=format&q=80",
    worship: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop&auto=format&q=80",
    handsRaised: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=640&h=360&fit=crop&auto=format&q=80",
    gathering: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&h=600&fit=crop&auto=format&q=80",
  },

  /**
   * Ministry Images
   */
  ministries: {
    youth: {
      main: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop&auto=format&q=80",
      worship: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop&auto=format&q=80",
      camping: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&h=400&fit=crop&auto=format&q=80",
    },
    womens: {
      main: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=600&h=400&fit=crop&auto=format&q=80",
      fellowship: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop&auto=format&q=80",
    },
    mens: {
      main: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&auto=format&q=80",
      fellowship: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=400&h=300&fit=crop&auto=format&q=80",
    },
    music: {
      main: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&auto=format&q=80",
      choir: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop&auto=format&q=80",
      worship: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop&auto=format&q=80",
    },
    community: {
      main: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&auto=format&q=80",
      service: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop&auto=format&q=80",
    },
    pathfinders: {
      main: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&h=400&fit=crop&auto=format&q=80",
      outdoor: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&h=400&fit=crop&auto=format&q=80",
    },
  },

  /**
   * Historical & About Page Images
   */
  history: {
    vintage: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&h=600&fit=crop&auto=format&q=80",
    oldChurch: "https://images.unsplash.com/photo-1504825676736-5e21d1b42dee?w=800&h=600&fit=crop&auto=format&q=80",
    /** 
     * Historical photos from old site (lilliputsda.interamerica.org)
     * These are original church photos - labeled with year/era
     */
    oldSite: [
      {
        src: "/images/history/old_church_congregation.jpg",
        alt: "Old photo of church",
        caption: "Old photo of church",
        year: "",
      },
      {
        src: "/images/history/current_church_building_2016.jpg",
        alt: "",
        caption: "",
        year: "",
      },
      {
        src: "/images/history/pastor_taylor.jpg",
        alt: "Pastor Taylor",
        caption: "Pastor Taylor",
        year: "",
      },
      {
        src: "/images/history/bro_wright_slide.jpg",
        alt: "Brother Wright",
        caption: "Brother Wright",
        year: "",
      },
      {
        src: "/images/history/img_20161018_worship.jpg",
        alt: "Worship service",
        caption: "Fellowship and worship",
        year: "October 18, 2016",
      },
      {
        src: "/images/history/img_20161016_group1.jpg",
        alt: "Pathfinder Club photo",
        caption: "Pathfinder Club",
        year: "October 16, 2016",
      },
      {
        src: "/images/history/img_20161016_group2.jpg",
        alt: "Church group photo",
        caption: "Fellowship and community",
        year: "October 16, 2016",
      },
      {
        src: "/images/history/fb_img_2016_group.jpg",
        alt: "Facebook group photo",
        caption: "Church community",
        year: "July 26, 2016",
      },
      {
        src: "/images/history/fb_img_2016_worship.jpg",
        alt: "Facebook worship photo",
        caption: "Worship and praise",
        year: "September 16, 2016",
      },
    ],
  },

  /**
   * Pastor & Staff Headshots
   * Note: These are placeholder professional portraits
   * Replace with actual staff photos when available
   */
  staff: {
    pastor: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format&q=80",
    placeholder: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format&q=80",
  },

  /**
   * Generic Placeholder for Dynamic Content
   */
  placeholder: {
    sermon: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=640&h=360&fit=crop&auto=format&q=80",
  },
} as const;

/**
 * Get optimized Unsplash URL with custom dimensions
 */
export function getUnsplashImage(
  photoId: string,
  width: number,
  height: number,
  quality: number = 80
): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=${quality}`;
}

/**
 * Image size presets for consistent usage
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 400, height: 300 },
  card: { width: 600, height: 400 },
  hero: { width: 1920, height: 1080 },
  heroSmall: { width: 1920, height: 600 },
  square: { width: 400, height: 400 },
  video: { width: 640, height: 360 },
} as const;
