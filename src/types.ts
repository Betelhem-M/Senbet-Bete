export type Role = 'user' | 'admin';
export type Status = 'pending' | 'approved' | 'rejected';
export type Gender = 'Male' | 'Female';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: Role;
  gender: Gender;
  age: number;
  dateOfBirth?: string;
  class?: number;
  status: Status;
  createdAt: string;
}

export interface Event {
  id: string;
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  date: string;
  createdBy: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title?: string;
  titleKey?: string;
  fileURL: string;
  uploadedBy: string;
  createdAt: string;
}

export interface AboutSection {
  id: string;
  titleKey: string; // Translation key: mission, vision, history, achievements
  content?: string;
  contentKey?: string;
  iconName: string; // Lucide icon name
  color: string; // Tailwind gradient classes
}

export interface Schedule {
  id: string;
  class: number;
  course: string;
  weekend: string; // e.g., "March 28-29" or a specific date
}

export type Language = 'en' | 'am';

export interface Translation {
  welcome: string;
  tagline: string;
  login: string;
  register: string;
  home: string;
  about: string;
  events: string;
  store: string;
  logout: string;
  admin: string;
  fullName: string;
  email: string;
  password: string;
  gender: string;
  age: string;
  male: string;
  female: string;
  submit: string;
  pendingApproval: string;
  approved: string;
  rejected: string;
  mission: string;
  vision: string;
  history: string;
  achievements: string;
  uploadBook: string;
  createEvent: string;
  totalStudents: string;
  classDistribution: string;
  genderDistribution: string;
  language: string;
}
