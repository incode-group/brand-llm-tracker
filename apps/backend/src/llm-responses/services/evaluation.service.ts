import { Injectable, Logger } from '@nestjs/common';
import { GeneratedPrompt, TotalEvaluation, CategoryEvaluation, NicheMentionAnalysis, ComparisonRankAnalysis, IdentityMatchAnalysis, AuthorityMentionAnalysis } from '../types';

@Injectable()
export class EvaluationService {
  private readonly logger = new Logger(EvaluationService.name);

  // Default weights
  private weights = {
    identity: 0.05,
    comparison: 0.15,
    niche: 0.4,
    authority: 0.4,
  };

  /**
   * Set custom weights for evaluation
   */
  setWeights(newWeights: Partial<typeof this.weights>) {
    this.weights = { ...this.weights, ...newWeights };
  }

  getWeights() {
    return this.weights;
  }



  private groupPromptsByCategory(prompts: GeneratedPrompt[]) {
    const grouped = {
      identity: [] as GeneratedPrompt[],
      comparison: [] as GeneratedPrompt[],
      niche: [] as GeneratedPrompt[],
      authority: [] as GeneratedPrompt[],
    };

    for (const p of prompts) {
      if (p.category === 'custom') continue;
      
      // explicit check to satisfy TS
      if (p.category === 'identity' || p.category === 'comparison' || p.category === 'niche' || p.category === 'authority') {
        grouped[p.category].push(p);
      }
    }

    return grouped;
  }
  

/**
   * Evaluate a list of analyzed prompts
   */
  evaluate(prompts: GeneratedPrompt[], brandName: string): TotalEvaluation {
    this.logger.log(`Evaluating ${prompts.length} prompts for brand: ${brandName}...`);

    const grouped = this.groupPromptsByCategory(prompts);

    const identityEval = this.evaluateIdentity(grouped.identity);
    const comparisonEval = this.evaluateComparison(grouped.comparison, brandName);
    const nicheEval = this.evaluateNiche(grouped.niche);
    const authorityEval = this.evaluateAuthority(grouped.authority);

    // Теперь каждый weightedScore — это (0..100) * weight
    // Сумма даст число от 0 до 100
    const totalScore = 
      identityEval.weightedScore +
      comparisonEval.weightedScore +
      nicheEval.weightedScore +
      authorityEval.weightedScore;

    return {
      totalScore,
      breakdown: {
        identity: identityEval,
        comparison: comparisonEval,
        niche: nicheEval,
        authority: authorityEval,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private evaluateIdentity(prompts: GeneratedPrompt[]): CategoryEvaluation {
    let totalIdentityScore = 0;
    let count = 0;

    for (const p of prompts) {
      if (p.analysis && (p.analysis as IdentityMatchAnalysis).score !== undefined) {
        totalIdentityScore += Number((p.analysis as IdentityMatchAnalysis).score);
        count++;
      }
    }

    // Приводим к 100 баллам. Если средний балл 10/10, то score будет 100.
    const score100 = count > 0 ? (totalIdentityScore / (count * 10)) * 100 : 0;
    
    return {
      category: 'identity',
      score: score100, // Сохраняем в базе 100
      weight: this.weights.identity,
      weightedScore: score100 * this.weights.identity, // 100 * 0.05 = 5
      details: { count, totalIdentityScore }
    };
  }

  private evaluateComparison(prompts: GeneratedPrompt[], brandName: string): CategoryEvaluation {
    let sumS = 0;
    let count = 0;

    for (const p of prompts) {
      const analysis = p.analysis as ComparisonRankAnalysis;
      if (!analysis || !analysis.brands_by_rank) continue;

      const brands = analysis.brands_by_rank;
      const N = brands.length;
      const index = brands.findIndex(b => b.toLowerCase().includes(brandName.toLowerCase()));
      
      const s = index !== -1 ? (N - index) / N : 0;      
      sumS += s;
      count++;
    }

    const avgS = count > 0 ? (sumS / count) : 0;
    const score100 = avgS * 100; // Приводим к 100 баллам

    return {
      category: 'comparison',
      score: score100,
      weight: this.weights.comparison,
      weightedScore: score100 * this.weights.comparison, // 100 * 0.15 = 15
      details: { count, sumS }
    };
  }

  private evaluateNiche(prompts: GeneratedPrompt[]): CategoryEvaluation {
    let mentions = 0;
    const count = prompts.length;

    for (const p of prompts) {
      if ((p.analysis as NicheMentionAnalysis)?.mentioned) {
        mentions++;
      }
    }

    // НЕЛИНЕЙНАЯ ШКАЛА: первое упоминание — самое важное
    let score100 = 0;
    if (count > 0 && mentions > 0) {
      const ratio = mentions / count;
      // Если есть хоть одно упоминание, даем минимум 50 баллов, остальное дотягиваем по ratio
      score100 = 50 + (ratio * 50); 
    }

    return {
      category: 'niche',
      score: score100,
      weight: this.weights.niche,
      weightedScore: score100 * this.weights.niche,
      details: { count, mentions }
    };
  }

  private evaluateAuthority(prompts: GeneratedPrompt[]): CategoryEvaluation {
    let mentions = 0;
    const count = prompts.length;

    for (const p of prompts) {
      if ((p.analysis as AuthorityMentionAnalysis)?.mentioned) {
        mentions++;
      }
    }

    // В Authority Nike обычно упоминается чаще, тут можно оставить линейно
    const score100 = count > 0 ? (mentions / count) : 0;
    const finalScore = score100 * 100;

    return {
      category: 'authority',
      score: finalScore,
      weight: this.weights.authority,
      weightedScore: finalScore * this.weights.authority,
      details: { count, mentions }
    };
  }
}
