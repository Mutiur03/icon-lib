export type TechnologyCategory =
  | "language"
  | "frontend"
  | "backend"
  | "database"
  | "cloud"
  | "devops"
  | "ai"
  | "tool"
  | "other";

export type TechnologySource = "skillicon" | "devicon" | "custom";

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  source: TechnologySource;
  iconUrl: string;
  website?: string;
  featured?: boolean;
  color?: string;
}

export interface TechnologyMetadata {
  skillLevel?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
  projectCount?: number;
  featuredProjectIds?: string[];
  githubTopics?: string[];
  stats?: Record<string, number>;
}

export interface TechnologyIconSources {
  custom?: string;
  skillicon?: string;
  devicon?: string;
}

export interface TechnologyRecord extends Technology {
  aliases?: string[];
  iconSources?: TechnologyIconSources;
  metadata?: TechnologyMetadata;
}

export interface ResolvedTechnology extends TechnologyRecord {
  resolvedIconUrl: string;
  resolvedSource: TechnologySource | "fallback";
}
