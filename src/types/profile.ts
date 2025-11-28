export interface Skill {
  name: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  startDate: string;
  endDate: string | null;
  technologies: string[];
  url?: string;
  highlights?: string;
}

export interface Certification {
  id: string;
  name: string;
  date: string;
  url?: string;
}

export interface Language {
  name: string;
  level: string; // e.g., "母语", "流利", "工作语言"
}

export interface ProfileData {
  id: number; // Auto-increment primary key
  userId: string; // User-friendly identifier for URL
  name: string;
  nameEn?: string;
  title: string;
  email: string;
  phone: string;
  location?: string;
  gender: string; // 性别：男、女
  avatar?: string;
  summary?: string;
  github?: string;
  website?: string;
  skills?: Skill[];
  experiences?: Experience[];
  education?: Education;
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
}
