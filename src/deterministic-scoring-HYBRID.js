// ==========================================
// DETERMINISTIC SCORING - HYBRID SYSTEM
// Calculate final scores based on validated counts
// ==========================================

/**
 * Calculate final score using validated counts
 * This is STEP 4 of the hybrid pipeline
 * 
 * @param {object} validatedCounts - Validated counts from Claude
 * @param {object} parserCounts - Original parser counts
 * @returns {object} - Final score breakdown
 */
function calculateScore(validatedCounts, parserCounts) {
  // ==========================================
  // GRAAF FRAMEWORK (50 POINTS)
  // ==========================================
  
  const graaf = {
    // G - GENUINELY CREDIBLE (10 pts)
    credibility: {
      expertQuotes: scoreExpertQuotes(validatedCounts.expertQuotes || 0),
      statistics: scoreStatistics(validatedCounts.statistics || 0),
      sourceCitations: scoreSourceCitations(validatedCounts.sourceCitations || 0),
      total: 0
    },
    
    // R - RELEVANCE (10 pts)
    relevance: {
      keywordInTitle: 3, // Default - can be calculated with actual keyword
      keywordInFirst100: 3, // Default
      keywordDensity: 3, // Default
      lsiKeywords: scoreLSIKeywords(validatedCounts.lsiKeywords || 0),
      total: 0
    },
    
    // A - ACTIONABILITY (10 pts)
    actionability: {
      stepByStep: scoreStepByStep(validatedCounts.stepByStep || 0),
      examples: scoreExamples(validatedCounts.examples || 0),
      ctas: scoreCTAs(validatedCounts.ctas || 0),
      toolsResources: scoreToolsResources(validatedCounts.toolsResources || 0),
      total: 0
    },
    
    // A - ACCURACY (10 pts)
    accuracy: {
      dataCitations: scoreDataCitations(validatedCounts.dataCitations || 0),
      caseStudies: scoreCaseStudies(validatedCounts.caseStudies || 0),
      factSources: scoreFactSources(validatedCounts.factSources || 0),
      publicationDate: validatedCounts.publicationDate > 0 ? 2 : 0,
      total: 0
    },
    
    // F - FRESHNESS (10 pts)
    freshness: {
      lastModified: validatedCounts.lastModified > 0 ? 3 : 0,
      currentYearMentions: scoreYearMentions(validatedCounts.currentYearMentions || 0),
      dataRecency: scoreDataRecency(validatedCounts.dataRecency || 0),
      trendingTopics: validatedCounts.trendingTopics > 0 ? 1 : 0,
      total: 0
    },
    
    total: 0
  };
  
  // Calculate totals
  graaf.credibility.total = graaf.credibility.expertQuotes + graaf.credibility.statistics + graaf.credibility.sourceCitations;
  graaf.relevance.total = graaf.relevance.keywordInTitle + graaf.relevance.keywordInFirst100 + graaf.relevance.keywordDensity + graaf.relevance.lsiKeywords;
  graaf.actionability.total = graaf.actionability.stepByStep + graaf.actionability.examples + graaf.actionability.ctas + graaf.actionability.toolsResources;
  graaf.accuracy.total = graaf.accuracy.dataCitations + graaf.accuracy.caseStudies + graaf.accuracy.factSources + graaf.accuracy.publicationDate;
  graaf.freshness.total = graaf.freshness.lastModified + graaf.freshness.currentYearMentions + graaf.freshness.dataRecency + graaf.freshness.trendingTopics;
  
  graaf.total = graaf.credibility.total + graaf.relevance.total + graaf.actionability.total + graaf.accuracy.total + graaf.freshness.total;
  
  // ==========================================
  // CRAFT FRAMEWORK (30 POINTS)
  // ==========================================
  
  const craft = {
    // C - CUT THE FLUFF (7 pts)
    cutFluff: {
      fleschScore: scoreFleschScore(validatedCounts.fleschScore || 50),
      sentenceLength: scoreSentenceLength(validatedCounts.avgSentenceLength || 20),
      shortParagraphs: scoreParagraphs(validatedCounts.longParagraphs || 0),
      total: 0
    },
    
    // R - REVIEW & OPTIMIZE (8 pts)
    reviewOptimize: {
      keywordOptimization: 3, // Default
      metaTitleLength: scoreMetaTitleLength(validatedCounts.metaTitleLength || 0),
      metaDescLength: scoreMetaDescLength(validatedCounts.metaDescLength || 0),
      lsiKeywords: scoreLSIKeywords(validatedCounts.lsiKeywords || 0),
      total: 0
    },
    
    // A - ADD VISUALS (6 pts)
    addVisuals: {
      imagesWithAlt: scoreImages(validatedCounts.imagesWithAlt || 0),
      videos: validatedCounts.videos > 0 ? 1 : 0,
      tables: scoreTables(validatedCounts.tables || 0),
      comparisonTables: validatedCounts.comparisonTables > 0 ? 1 : 0,
      total: 0
    },
    
    // F - FAQ INTEGRATION (5 pts)
    faqIntegration: {
      faqCount: scoreFAQCount(validatedCounts.faqCount || 0),
      faqAnswerLength: 1, // Default
      faqHeading: validatedCounts.faqSchema > 0 ? 1 : 0,
      total: 0
    },
    
    // T - TRUST BUILDING (4 pts)
    trustBuilding: {
      authorBio: validatedCounts.authorBio > 0 ? 1 : 0,
      credentials: validatedCounts.credentials > 0 ? 1 : 0,
      testimonials: validatedCounts.testimonials > 0 ? 1 : 0,
      authorityLinks: scoreAuthorityLinks(validatedCounts.authorityLinks || 0),
      total: 0
    },
    
    total: 0
  };
  
  // Calculate totals
  craft.cutFluff.total = craft.cutFluff.fleschScore + craft.cutFluff.sentenceLength + craft.cutFluff.shortParagraphs;
  craft.reviewOptimize.total = craft.reviewOptimize.keywordOptimization + craft.reviewOptimize.metaTitleLength + craft.reviewOptimize.metaDescLength + craft.reviewOptimize.lsiKeywords;
  craft.addVisuals.total = craft.addVisuals.imagesWithAlt + craft.addVisuals.videos + craft.addVisuals.tables + craft.addVisuals.comparisonTables;
  craft.faqIntegration.total = craft.faqIntegration.faqCount + craft.faqIntegration.faqAnswerLength + craft.faqIntegration.faqHeading;
  craft.trustBuilding.total = craft.trustBuilding.authorBio + craft.trustBuilding.credentials + craft.trustBuilding.testimonials + craft.trustBuilding.authorityLinks;
  
  craft.total = craft.cutFluff.total + craft.reviewOptimize.total + craft.addVisuals.total + craft.faqIntegration.total + craft.trustBuilding.total;
  
  // ==========================================
  // TECHNICAL SEO (20 POINTS)
  // ==========================================
  
  const technical = {
    metaTitleLength: scoreMetaTitleLength(validatedCounts.metaTitleLength || 0),
    metaDescLength: scoreMetaDescLength(validatedCounts.metaDescLength || 0),
    schemaMarkup: scoreSchemaMarkup(validatedCounts.schemaTypes || 0),
    internalLinks: scoreInternalLinks(validatedCounts.internalLinks || 0),
    headingHierarchy: validatedCounts.headingHierarchy > 0 ? 3 : 0,
    tableOfContents: validatedCounts.tableOfContents > 0 ? 2 : 0,
    mobileResponsive: validatedCounts.mobileResponsive > 0 ? 1 : 0,
    total: 0
  };
  
  technical.total = technical.metaTitleLength + technical.metaDescLength + technical.schemaMarkup + 
                    technical.internalLinks + technical.headingHierarchy + technical.tableOfContents + 
                    technical.mobileResponsive;
  
  // ==========================================
  // FINAL SCORE
  // ==========================================
  
  const total = graaf.total + craft.total + technical.total;
  
  return {
    total: Math.round(total),
    graaf,
    craft,
    technical
  };
}

// ==========================================
// SCORING FUNCTIONS
// ==========================================

function scoreExpertQuotes(count) {
  if (count >= 3) return 4;
  if (count === 2) return 3;
  if (count === 1) return 2;
  return 0;
}

function scoreStatistics(count) {
  if (count >= 10) return 3;
  if (count >= 5) return 2;
  if (count >= 1) return 1;
  return 0;
}

function scoreSourceCitations(count) {
  if (count >= 5) return 3;
  if (count >= 3) return 2;
  if (count >= 1) return 1;
  return 0;
}

function scoreLSIKeywords(count) {
  return count >= 8 ? 1 : 0;
}

function scoreStepByStep(count) {
  if (count >= 5) return 3;
  if (count >= 3) return 2;
  if (count >= 1) return 1;
  return 0;
}

function scoreExamples(count) {
  if (count >= 3) return 3;
  if (count === 2) return 2;
  if (count === 1) return 1;
  return 0;
}

function scoreCTAs(count) {
  if (count >= 3) return 3;
  if (count === 2) return 2;
  if (count >= 1) return 1;
  return 0;
}

function scoreToolsResources(count) {
  return count > 0 ? 1 : 0;
}

function scoreDataCitations(count) {
  if (count >= 5) return 3;
  if (count >= 3) return 2;
  if (count >= 1) return 1;
  return 0;
}

function scoreCaseStudies(count) {
  if (count >= 2) return 3;
  if (count === 1) return 2;
  return 0;
}

function scoreFactSources(count) {
  if (count >= 3) return 2;
  if (count >= 1) return 1;
  return 0;
}

function scoreYearMentions(count) {
  if (count >= 3) return 3;
  if (count === 2) return 2;
  if (count === 1) return 1;
  return 0;
}

function scoreDataRecency(count) {
  if (count >= 3) return 3;
  if (count >= 2) return 2;
  if (count >= 1) return 1;
  return 0;
}

function scoreFleschScore(score) {
  if (score >= 60 && score <= 70) return 3;
  if ((score >= 50 && score < 60) || (score > 70 && score <= 80)) return 2;
  if (score >= 40 && score < 50) return 1;
  return 0;
}

function scoreSentenceLength(avgLength) {
  if (avgLength <= 20) return 2;
  if (avgLength <= 25) return 1;
  return 0;
}

function scoreParagraphs(longCount) {
  if (longCount <= 2) return 2;
  if (longCount <= 4) return 1;
  return 0;
}

function scoreMetaTitleLength(length) {
  if (length >= 50 && length <= 60) return 3;
  if (length >= 40 && length < 50) return 2;
  if ((length >= 30 && length < 40) || (length > 60 && length <= 70)) return 1;
  return 0;
}

function scoreMetaDescLength(length) {
  if (length >= 140 && length <= 160) return 3;
  if (length >= 120 && length < 140) return 2;
  if ((length >= 100 && length < 120) || (length > 160 && length <= 180)) return 1;
  return 0;
}

function scoreImages(count) {
  if (count >= 3) return 2;
  if (count >= 1) return 1;
  return 0;
}

function scoreTables(count) {
  if (count >= 2) return 2;
  if (count === 1) return 1;
  return 0;
}

function scoreFAQCount(count) {
  if (count >= 8) return 3;
  if (count >= 5) return 2;
  if (count >= 3) return 1;
  return 0;
}

function scoreAuthorityLinks(count) {
  return count >= 3 ? 1 : 0;
}

function scoreSchemaMarkup(typeCount) {
  if (typeCount >= 3) return 4;
  if (typeCount >= 2) return 3;
  if (typeCount >= 1) return 2;
  return 0;
}

function scoreInternalLinks(count) {
  if (count >= 30) return 4;
  if (count >= 20) return 3;
  if (count >= 10) return 2;
  if (count >= 5) return 1;
  return 0;
}

module.exports = {
  calculateScore
};
