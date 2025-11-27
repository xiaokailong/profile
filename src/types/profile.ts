export interface Skill {
  name: string;
  level: number; // 1-5
  category: string; // e.g., "前端", "后端", "工具"
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
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
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
  github?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Language {
  name: string;
  level: string; // e.g., "母语", "流利", "工作语言"
}

export interface ProfileData {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  summary?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  blog?: string;
  skills?: Skill[];
  experiences?: Experience[];
  education?: Education[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
}
