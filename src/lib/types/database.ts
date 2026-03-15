export interface Profile {
  id: string
  full_name: string
  title: string
  tagline: string | null
  bio: string | null
  avatar_url: string | null
  resume_url: string | null
  email: string | null
  phone: string | null
  location: string | null
  github_url: string | null
  linkedin_url: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  short_description: string | null
  full_description: string | null
  tech_stack: string[]
  github_url: string | null
  live_url: string | null
  playstore_url: string | null
  appstore_url: string | null
  thumbnail_url: string | null
  featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface ProjectImage {
  id: string
  project_id: string
  image_url: string
  alt_text: string | null
  display_order: number
  created_at: string
}

export interface Experience {
  id: string
  company: string
  role: string
  description: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field_of_study: string | null
  start_date: string
  end_date: string | null
  description: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  display_order: number
  created_at: string
}

export interface Statistic {
  id: string
  label: string
  value: number
  suffix: string | null
  icon_name: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

export interface PinnedRepo {
  name: string
  nameWithOwner: string
  description: string | null
  url: string
  stargazerCount: number
  forkCount: number
  primaryLanguage: { name: string; color: string } | null
}

export interface GitHubData {
  pinnedRepos: PinnedRepo[]
  totalContributions: number
  totalRepos: number
  totalStars: number
  contributionDays: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>
}
