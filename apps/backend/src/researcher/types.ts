export interface BrandIdentity {
  description: string;
  niche: string[];
  tagline: string | null;
}

export interface MarketPresence {
  mainLocation: string;
  otherRegions: string[];
  keywords: string[];
}

export interface Offerings {
  products: string[];
}

export interface BrandResearchResult {
  brandIdentity: BrandIdentity;
  marketPresence: MarketPresence;
  offerings: Offerings;
  metadata: {
    confidenceScore: number;
    dataCompleteness: 'low' | 'medium' | 'high';
  };
}

export interface Brand {
  name: string;
  website: string;
  location: string;
  researchResult?: BrandResearchResult;
}