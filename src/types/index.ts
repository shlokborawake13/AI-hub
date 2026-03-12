export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_content?: string;
  domain: string;
  tech_stack: string[];
  thumbnail_url: string;
  github_url?: string;
  demo_url?: string;
  team_members?: string[];
  year: number;
  is_featured: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner_url: string;
  start_datetime: string;
  end_datetime: string;
  mode: "online" | "offline" | "hybrid";
  location?: string;
  registration_link?: string;
  is_upcoming: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  cover_image_url: string;
  author_id: string;
  author?: TeamMember;
  category: string;
  tags: string[];
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  pdf_url?: string;
  external_link?: string;
  published_year: number;
  domain: string;
  is_featured: boolean;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "core" | "faculty" | "alumni";
  avatar_url: string;
  linkedin_url?: string;
  order_index: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface CommunityApplication {
  id: string;
  name: string;
  email: string;
  course: string;
  year: number;
  motivation: string;
  skills: string;
  status: "pending" | "approved" | "rejected";
  applied_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
  quote: string;
}
