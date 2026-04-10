export type {
  ChurchEvent,
  Announcement,
  Ministry,
  StaffMember,
  ContactSubmission,
  PrayerRequest,
} from "@/types";

export type EventCategory = "service" | "special" | "youth" | "community";
export type AnnouncementPriority = "low" | "normal" | "high";
export type AnnouncementCategory = "youth" | "community" | "general" | "ministry";
export type MinistryCategory = "youth" | "adult" | "family" | "music";
export type Department = "pastoral" | "elder" | "deacon" | "music" | "youth" | "children" | "hospital" | "media";

export interface AdminEvent {
  id: string;
  _creationTime: number;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  category: EventCategory;
  imageUrl?: string;
  isRecurring: boolean;
  recurrencePattern?: "weekly" | "monthly";
}

export interface AdminAnnouncement {
  id: string;
  _creationTime: number;
  title: string;
  content: string;
  date: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  imageUrl?: string;
  expiresAt?: string;
  isPinned: boolean;
}

export interface AdminMinistry {
  id: string;
  _creationTime: number;
  name: string;
  description: string;
  category: MinistryCategory;
  imageUrl?: string;
  leaderId?: string;
  meetingTime?: string;
  meetingLocation?: string;
  order: number;
}

export interface AdminStaff {
  id: string;
  _creationTime: number;
  name: string;
  title: string;
  role?: string;
  department?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  isActive: boolean;
  order: number;
}

export interface AdminContactSubmission {
  id: string;
  _creationTime: number;
  name: string;
  email: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface AdminPrayerRequest {
  id: string;
  _creationTime: number;
  name: string;
  email: string;
  request: string;
  isPublic: boolean;
  isAnswered: boolean;
  date: string;
}
