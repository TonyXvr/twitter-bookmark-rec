export interface Bookmark {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  dateAdded?: string;
}

export interface AIToolRecommendation {
  name: string;
  description: string;
  url: string;
  category: string;
  matchReason: string;
}

export type AIModel = 'openai' | 'perplexity';
