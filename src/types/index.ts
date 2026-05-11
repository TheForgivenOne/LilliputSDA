export type VideoStatus = "live" | "upcoming" | "past";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  duration: string;
  viewCount: string;
  status: VideoStatus;
  scheduledStartTime?: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  time?: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  isRecurring?: boolean;
  recurrencePattern?: "weekly" | "monthly";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority?: string;
  category?: string;
  imageUrl?: string;
  expiresAt?: string;
  isPinned?: boolean;
}

export interface Ministry {
  id?: string;
  name: string;
  description?: string;
  leaderId?: string;
  leader?: string;
  meetingTime?: string;
  meetingLocation?: string;
  imageUrl?: string;
  category?: string;
  order?: number;
}

export interface StaffMember {
  id: string;
  department?: string;
  name: string;
  role: string;
  title: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  bio?: string;
  order?: number;
  isActive?: boolean;
}

export interface PrayerRequest {
  id?: string;
  name: string;
  email: string;
  request: string;
  isPublic?: boolean;
  isAnswered?: boolean;
  date?: string;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  date?: string;
  isRead?: boolean;
}

export type UserRole = "admin" | "editor" | "member";

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface NetworkStatus {
  isOnline: boolean;
  wasOffline?: boolean;
  lastChecked?: number;
}

export interface ScriptureResult {
  reference: string;
  text: string;
  translation?: string;
  book?: string;
  chapter?: number;
  verse?: number;
}
