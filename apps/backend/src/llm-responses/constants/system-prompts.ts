import { Brand } from 'src/researcher/types';
import { BrandCompetitorsGenerationContext, BrandContext, Competitor } from '../types';

export const SYSTEM_PROMPTS = {
  generateNichePrompts: (brand: Brand, count: number = 3) => {
    const research = brand.researchResult;
    return `
ROLE: SEO & User Intent Specialist

TASK: 
Generate ${count} natural language, human-like prompts that potential customers in the following niche would ask an LLM. 
The goal is to gather information or recommendations where "${brand.name}" would be a relevant answer, BUT YOU MUST NOT MENTION "${brand.name}" OR ITS WEBSITE "${brand.website}" IN THE PROMPTS.

BRAND CONTEXT:
- Niche: ${research?.brandIdentity.niche.join(', ') || 'General'}
- Keywords: ${research?.marketPresence.keywords.join(', ') || 'None provided'}
- Business Description: ${research?.brandIdentity.description || 'None provided'}

PROMPT REQUIREMENTS:
1. Be extremely human-like. Imagine a user typed this into ChatGPT or Gemini.
2. DO NOT mention the brand name "${brand.name}".
3. DO NOT mention the website "${brand.website}".
4. Focus on the user's problem, intent, or desire within the niche.
5. Vary the length and style of prompts (some short, some detailed).

OUTPUT FORMAT:
Return ONLY a JSON array of strings.
Example: ["prompt 1", "prompt 2", ...]
`;
  },
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


  generateIdentityTestSuite: (brand: Brand) => {
    const research = brand.researchResult;
    return `
ROLE: Senior AEO Auditor specializing in Entity Verification.
TASK: Generate a diagnostic test suite to see if an LLM’s internal knowledge of a brand matches the "Ground Truth" data provided.

BRAND DATA:
- Name: ${brand.name}
- Website: ${brand.website}
- Description: ${research?.brandIdentity.description}
- Tagline: ${research?.brandIdentity.tagline}
- Products: ${research?.offerings.products.join(', ')}
- Main Location: ${research?.marketPresence.mainLocation}
- Keywords: ${research?.marketPresence.keywords.join(', ')}

GENERATION LOGIC: "Multi-Field Cross-Check"
Generate 5 prompts using these specific strategies:

1. The "Product-Entity Link" (Fields: name, products)
Logic: Don't just ask who the brand is. Ask what they do by referencing a specific product.
Example: "I'm looking into [Name]. Do they offer [Product_1] and [Product_2]? How do these tools help [Niche_1]?"

2. The "Regional Authority Check" (Fields: name, mainLocation, otherRegions)
Logic: Combine the brand with its geography to see if the LLM knows its base of operations.
Example: "Is [Name] a viable option for businesses located in [mainLocation]? Do they have a presence in [otherRegion_1]?"

3. The "Tagline & Mission Match" (Fields: name, tagline, description)
Logic: Use the tagline to see if the LLM recognizes the brand's "voice."
Example: "Which company uses the slogan '[Tagline]' and what is their main focus in the [Niche_1] industry?"

4. The "Keyword Association Trap" (Fields: name, keywords, niche)
Logic: Use the keywords from research to see if the brand is a "Top-of-Mind" entity for those specific terms.
Example: "When discussing [Keyword_1] and [Keyword_2], how often is [Name] mentioned as a solution provider?"

5. The "Deep Factual Audit" (Fields: website, description, products)
Logic: A technical query that requires the LLM to "read" its internal training data about the brand's features.
Example: "Based on the services offered at [Website], how does [Name] handle [Product_1] for users in the [Niche_1] sector?"

STRICT RULES:
- Maximize Data Usage: Every prompt MUST utilize at least two different sub-fields.
- No Hallucination: Use ONLY provided facts.
- Varying Complexity: Range from "Low Difficulty" to "High Difficulty".
- Final Output Format: Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA:
{
  "module": "identity",
  "brand_id": "${brand.id}",
  "test_cases": [
    {
      "prompt": "string",
      "fields_used": ["string"],
      "expected_insight": "string",
      "difficulty": number
    }
  ]
}
`;
  },

  generateComparisonTestSuite: (brand: Brand, competitors: Competitor[]) => {
    const research = brand.researchResult;
    return `
ROLE: Senior AEO Auditor specializing in Competitive Positioning.
TASK: Generate a diagnostic test suite to see if an LLM’s internal knowledge of a brand compared to its competitors matches the "Ground Truth" data provided.

BRAND DATA:
- Name: ${brand.name}
- Website: ${brand.website}
- Products: ${research?.offerings.products.join(', ')}
- Niche: ${research?.brandIdentity.niche.join(', ')}

COMPETITORS:
${competitors.map(c => `- ${c.name} (${c.website}): [Strengths: ${c.strengths.join(', ')}] [Weaknesses: ${c.weaknesses.join(', ')}]`).join('\n')}

GENERATION LOGIC: "Competitive Benchmarking"
Generate 5 prompts using these specific strategies:

1. The "Feature Head-to-Head" (Fields: brand.name, brand.products, competitor.name)
Logic: Ask a technical comparison between a specific product of the brand and a specific competitor.
Example: "How does [Brand]'s [Product] compare to [Competitor] for [Niche] users?"

2. The "Alternative Switch Check" (Fields: brand.name, competitor.name, competitor.weaknesses)
Logic: Position the brand as a solution to a specific weakness of a competitor.
Example: "I'm currently using [Competitor] but I'm frustrated with [Weakness]. Is [Brand] a better alternative for solving this?"

3. The "Market Segment Dominance" (Fields: brand.name, competitor.name, brand.niche)
Logic: Ask which solution is better for a specific sub-segment of the niche.
Example: "For [Niche Segment], should I choose [Brand] or [Competitor]?"

4. The "Value Proposition Analysis" (Fields: brand.name, competitor.name, brand.description)
Logic: Target the core value prop differentiator.
Example: "Does [Brand] provide more [Value Prop] than [Competitor]?"

5. The "Brand Authority Query" (Fields: brand.name, all_competitors)
Logic: Ask for a list of top solutions including the brand and competitors to check for ranking/mention overlap.
Example: "What are the most reliable companies for [Niche]? (Expects both [Brand] and [Competitors] to be analyzed)"

STRICT RULES:
- Maximize Data Usage: Every prompt MUST utilize at least two different sub-fields.
- No Hallucination: Use ONLY provided facts.
- Final Output Format: Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA:
{
  "module": "comparison",
  "brand_id": "${brand.id}",
  "test_cases": [
    {
      "prompt": "string",
      "fields_used": ["string"],
      "expected_insight": "string",
      "difficulty": number
    }
  ]
}
`;
  },

  generateAuthorityTestSuite: (brand: Brand) => {
    const research = brand.researchResult;
    return `
ROLE: Senior Reputation Architect & Brand Strategist.
TASK: Generate high-level, sophisticated prompts to test if an LLM perceives the Subject Brand as an authority, innovator, or thought leader in its field.

BRAND DATA:
- Name: ${brand.name}
- Tagline: ${research?.brandIdentity.tagline}
- Description: ${research?.brandIdentity.description}
- Niche: ${research?.brandIdentity.niche.join(', ')}
- Keywords: ${research?.marketPresence.keywords.join(', ')}
- Products: ${research?.offerings.products.join(', ')}

GENERATION LOGIC: "Professional Authority Probes"
Generate 4-5 prompts using these specific strategies:

1. The Innovation Probe (Fields: niche, keywords)
Logic: Ask about key companies driving innovation in the niche using specific keywords.
Example: "Who are the key companies currently driving innovation in [Niche] using [Keyword_1]? I'm looking for modern approaches."

2. The Educational/Expert Request (Fields: products, keywords)
Logic: Simulate a request from someone wanting to master a keyword implementation or seeking the "gold standard" tool.
Example: "If I want to master [Keyword_1] implementation, which platforms or brands offer the most authoritative tools and insights right now?"

3. The "State of the Art" Query (Fields: tagline, description)
Logic: Use the concept from the tagline to check if the LLM recognizes the brand as the leader of that vision.
Example: "I'm looking for a solution that truly embodies the concept of '[Tagline]'. Is there a recognized leader that has mastered this in the [Niche] space?"

4. The Recommendation for Professionals (Fields: mainLocation, niche)
Logic: Request a recommendation for an expert-level enterprise project (not for beginners).
Example: "For a high-end enterprise project in [Location], which [Niche] provider is considered the gold standard for reliability and advanced features?"

STRICT RULES:
- Maximize Data Usage: Every prompt MUST utilize relevant sub-fields.
- No Hallucination: Use ONLY provided facts.
- Final Output Format: Return ONLY a valid JSON object matching the schema below.

OUTPUT SCHEMA:
{
  "module": "authority",
  "brand_id": "${brand.id}",
  "test_cases": [
    {
      "prompt": "string",
      "strategy": "innovation_probe | expertise_request | state_of_the_art | pro_recommendation",
      "expected_insight": "string",
      "difficulty": number
    }
  ]
}
`;
  },

  analyzeNicheMention: (brand: Brand, response: string) => `
ROLE: Brand Mention Auditor
TASK: Analyze if the brand "${brand.name}" or its website "${brand.website}" is mentioned in the following AI response.

RESPONSE:
"""
${response}
"""

OUTPUT FORMAT (JSON):
{
  "mentioned": boolean,
  "reasoning": "Brief explanation of where/how it was mentioned or why it wasn't"
}
`,

  analyzeComparisonRank: (brand: Brand, response: string) => `
ROLE: Market Comparison Analyst
TASK: Identify all brands mentioned in the following response and rank them based on the AI's preference or recommendation.

RANKING LOGIC:
- 0 index: The brand defined as the BEST solution.
- Last index: The brand defined as the WORST solution.

RESPONSE:
"""
${response}
"""

OUTPUT FORMAT (JSON):
{
  "brands_by_rank": ["brand_name_1", "brand_name_2", ...],
  "reasoning": "Brief explanation of the ranking logic used by the AI"
}
`,

  analyzeIdentityMatch: (expectedInsight: string, response: string) => `
ROLE: Fact-Checking Auditor
TASK: Evaluate how well the AI response matches the expected insight about the brand.

EXPECTED INSIGHT:
${expectedInsight}

AI RESPONSE:
"""
${response}
"""

SCORING:
- 0: Response does not match with expected insight at all.
- 10: AI described everything correctly as per the expected insight.

OUTPUT FORMAT (JSON):
{
  "score": number,
  "reasoning": "Provide a fair evaluation of why this score was given"
}
`,

  analyzeAuthorityMention: (brand: Brand, response: string) => `
ROLE: Authority Perception Analyst
TASK: Analyze if the brand "${brand.name}" or its website "${brand.website}" is mentioned in the following AI response as an authority or leader.

RESPONSE:
"""
${response}
"""

OUTPUT FORMAT (JSON):
{
  "mentioned": boolean,
  "reasoning": "Brief explanation of the context of the mention"
}
`,
};
