import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CHURCH_IMAGES } from "./images";

export { CHURCH_IMAGES } from "./images";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    const later = () => {
      lastTime = Date.now();
      timeout = null;
      func(...args);
    };

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastTime = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/watch\?.*v=([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeThumbnail(videoId: string, quality: "default" | "medium" | "high" | "max" = "high"): string {
  const qualities = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    max: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${videoId}/${qualities[quality]}.jpg`;
}

export function decodeHtmlEntities(text: string): string {
  if (typeof window === "undefined") {
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }
  
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export function getDirection(locale?: string): "ltr" | "rtl" {
  const lang = locale || getUserLocale();
  const rtlLangs = ["ar", "he", "fa", "ur", "yi", "ps", "sd"];
  return rtlLangs.includes(lang.substring(0, 2)) ? "rtl" : "ltr";
}

export function isRTL(locale?: string): boolean {
  return getDirection(locale) === "rtl";
}

export function pluralize(
  count: number,
  singular: string,
  plural?: string,
  zero?: string
): string {
  if (count === 0 && zero) return zero;
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

export function getInitials(name: string, maxLength: number = 2): string {
  if (!name || !name.trim()) {
    return "?";
  }

  const cleaned = name.trim();

  if (cleaned.length === 0) {
    return "?";
  }

  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{1FAB0}-\u{1FABF}]|[\u{1FAC0}-\u{1FAFF}]|[\u{1FAD0}-\u{1FAFF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
  
  const hasOnlyEmoji = emojiRegex.test(cleaned) && !cleaned.replace(emojiRegex, '').trim();

  if (hasOnlyEmoji) {
    return cleaned.charAt(0) || "?";
  }

  const parts = cleaned.split(/[\s\u2000-\u206F\u2E00-\u2E7F]+/).filter(p => p.length > 0);
  
  if (parts.length >= 2) {
    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts[parts.length - 1].charAt(0);
    return (firstInitial + lastInitial).substring(0, maxLength).toUpperCase();
  }
  
  return cleaned.substring(0, maxLength).toUpperCase();
}

export function sanitizeInput(input: string, maxLength?: number): string {
  let sanitized = input.trim();
  
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

function getUserLocale(): string {
  if (typeof navigator !== 'undefined') {
    return (navigator as Navigator & { userLanguage?: string }).language || (navigator as Navigator & { userLanguage?: string }).userLanguage || 'en-US';
  }
  return 'en-US';
}

export function getPlaceholderImage(width: number, height: number, text?: string): string {
  const textMap: Record<string, string> = {
    "Church+Building": CHURCH_IMAGES.hero.churchBuilding,
    "Church+Congregation": CHURCH_IMAGES.congregation.main,
    "Youth+Ministry": CHURCH_IMAGES.ministries.youth.main,
    "Pathfinders": CHURCH_IMAGES.ministries.pathfinders.main,
    "Womens+Ministry": CHURCH_IMAGES.ministries.womens.main,
    "Mens+Ministry": CHURCH_IMAGES.ministries.mens.main,
    "Music+Ministry": CHURCH_IMAGES.ministries.music.main,
    "Community+Service": CHURCH_IMAGES.ministries.community.main,
    "Church+History": CHURCH_IMAGES.history.vintage,
    "Historical+Photos": CHURCH_IMAGES.history.oldChurch,
    "Pastor+L.+Hamilton": CHURCH_IMAGES.staff.pastor,
    "Sermon+Thumbnail": CHURCH_IMAGES.placeholder.sermon,
  };
  
  if (text && textMap[text]) {
    return textMap[text];
  }
  
  const encodedText = text ? encodeURIComponent(text) : `${width}x${height}`;
  return `https://placehold.co/${width}x${height}/d97706/white?text=${encodedText}`;
}

export function getChurchImage(key: keyof typeof CHURCH_IMAGES.hero | 
  keyof typeof CHURCH_IMAGES.congregation | 
  keyof typeof CHURCH_IMAGES.ministries.youth |
  keyof typeof CHURCH_IMAGES.ministries.womens |
  keyof typeof CHURCH_IMAGES.ministries.mens |
  keyof typeof CHURCH_IMAGES.ministries.music |
  keyof typeof CHURCH_IMAGES.ministries.community |
  keyof typeof CHURCH_IMAGES.ministries.pathfinders |
  keyof typeof CHURCH_IMAGES.history |
  keyof typeof CHURCH_IMAGES.staff |
  keyof typeof CHURCH_IMAGES.placeholder): string {
  
  const imageMap: Record<string, string> = {
    churchBuilding: CHURCH_IMAGES.hero.churchBuilding,
    churchExterior: CHURCH_IMAGES.hero.churchExterior,
    main: CHURCH_IMAGES.congregation.main,
    worship: CHURCH_IMAGES.congregation.worship,
    handsRaised: CHURCH_IMAGES.congregation.handsRaised,
    gathering: CHURCH_IMAGES.congregation.gathering,
    youthMain: CHURCH_IMAGES.ministries.youth.main,
    youthWorship: CHURCH_IMAGES.ministries.youth.worship,
    youthCamping: CHURCH_IMAGES.ministries.youth.camping,
    womensMain: CHURCH_IMAGES.ministries.womens.main,
    womensFellowship: CHURCH_IMAGES.ministries.womens.fellowship,
    mensMain: CHURCH_IMAGES.ministries.mens.main,
    mensFellowship: CHURCH_IMAGES.ministries.mens.fellowship,
    musicMain: CHURCH_IMAGES.ministries.music.main,
    musicChoir: CHURCH_IMAGES.ministries.music.choir,
    musicWorship: CHURCH_IMAGES.ministries.music.worship,
    communityMain: CHURCH_IMAGES.ministries.community.main,
    communityService: CHURCH_IMAGES.ministries.community.service,
    pathfindersMain: CHURCH_IMAGES.ministries.pathfinders.main,
    pathfindersOutdoor: CHURCH_IMAGES.ministries.pathfinders.outdoor,
    vintage: CHURCH_IMAGES.history.vintage,
    oldChurch: CHURCH_IMAGES.history.oldChurch,
    pastor: CHURCH_IMAGES.staff.pastor,
    placeholder: CHURCH_IMAGES.staff.placeholder,
    sermon: CHURCH_IMAGES.placeholder.sermon,
  };
  
  return imageMap[key] || CHURCH_IMAGES.placeholder.sermon;
}

const _unused = "trigger ci failure";

const x: number = "this should fail typecheck";

const x: number = "this should fail typecheck";

const x: number = "this should fail typecheck";

const x: number = "this should fail typecheck";

const x: number = "this should fail typecheck";

const x: number = "this should fail typecheck";

const x: number = "this should fail typecheck";

const x: number = "this should fail typecheck";

const x: number = "this should fail typecheck";

const x: number = "this should fail typecheck";
