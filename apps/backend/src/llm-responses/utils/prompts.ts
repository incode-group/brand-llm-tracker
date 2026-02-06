import { BrandCompetitorsGenerationContext, BrandContext, Competitor } from '../types';

export const PROMPTS = {
  generateCompetitors: (context: BrandCompetitorsGenerationContext) => `
You are an expert Market Intelligence Analyst. Your task is to identify 5 DIRECT competitors for the brand provided below. A direct competitor is defined as a business that offers a similar value proposition to the same target audience within the same economic context.

### BRAND PROFILE:
- Brand Name: ${context.name}
- Primary Operating Location (Headquarters/R&D): ${context.location}
- Target Sales Regions (Where they sell): ${context.regions?.join(', ')}
- Industry/Niche: ${context.niche?.join(', ')}
- Strategic Keywords: ${context.keywords?.join(', ')}
- Business Model Description: ${context.description}

### MANDATORY COMPETITOR SELECTION CRITERIA:
1. OPERATIONAL SIMILARITY: Competitors must operate with a similar cost structure and scale. If the brand is a boutique agency, find other boutique agencies. If it is a mid-market manufacturer, find mid-market manufacturers. 
2. GEOGRAPHIC COMPETITION: They must be fighting for the same customers in {{regions}}. If {{location}} is a key part of the brand's identity or delivery model, the competitors must share that geographic trait.
3. CUSTOMER INTENT: The competitors must be companies that a customer would realistically consider as an alternative to {{name}}.
4. DATA INTEGRITY: Every competitor must be a real, currently active entity. All URLs must be valid. Cross-reference data across industry-standard directories and professional platforms.

### ANALYSIS REQUIREMENTS:
- Strengths: Identify what they do better (e.g., pricing, brand authority, specific features, or logistics).
- Weaknesses: Identify where they underperform (e.g., limited service area, outdated technology, or poor customer sentiment).

### OUTPUT FORMAT (Strict JSON):
Return ONLY a valid JSON array of objects:
[
  {
    "name": "string",
    "website": "string",
    "strengths": ["string"],
    "weaknesses": ["string"]
  }
]

CRITICAL: DO NOT hallucinate. If you cannot find 5 100% verifiable competitors, provide only the ones you can confirm.`,

  // 2. Niche Prompt Generation
  generateNichePrompts: (context: BrandContext, count: number = 10) => `
    ROLE: SEO & User Intent Specialist
    TASK: Generate ${count} natural language prompts that potential customers in the "${context.niche?.join(', ') || 'general'}" niche would ask an LLM.
    KEYWORDS: ${context.keywords?.join(', ') || 'None provided'}
    GOAL: These prompts should be broad enough to potentially trigger a recommendation for "${context.brandName}".
    OUTPUT: JSON array of strings.
  `,

  // 3a. Identity Analysis
  analyzeIdentity: (context: BrandContext) => `
    ROLE: Brand Analyst
    TASK: Describe the public perception of "${context.brandName}" based on its online footprint.
    OUTPUT: JSON (sentiment, brand_perception, key_themes)
  `,

  // 3b. Comparison Analysis
  compareBrand: (context: BrandContext, competitor: Competitor) => `
    ROLE: Product Reviewer
    TASK: Compare "${context.brandName}" vs "${competitor.name}".
    CRITERIA: Which product is better for a typical SMB user?
    OUTPUT: JSON (better_product, reasoning)
  `,

  // 3c. Mention Check (This is the "User" prompt to the LLM)
  mentionCheck: (nichePrompt: string) => `
    ${nichePrompt}
  `,
};
