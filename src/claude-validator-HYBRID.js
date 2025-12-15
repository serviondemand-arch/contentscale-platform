// ==========================================
// CLAUDE VALIDATOR - HYBRID SYSTEM
// Validates parser output based on quality criteria
// Returns validated counts for deterministic scoring
// ==========================================

const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Main validation function
 * @param {Object} parserOutput - Output from content-parser
 * @returns {Object} Validated counts + rejection details
 */
async function validateContent(parserOutput) {
  console.log('🤖 CLAUDE: Starting validation...');
  
  const validationPrompt = buildValidationPrompt(parserOutput);
  
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0, // Deterministic!
      messages: [{
        role: 'user',
        content: validationPrompt
      }]
    });
    
    const responseText = message.content[0].text;
    const validation = parseValidationResponse(responseText);
    
    console.log(`✅ CLAUDE: Validated ${validation.expertQuotes}/${parserOutput.counts.expertQuotes} quotes`);
    console.log(`✅ CLAUDE: Validated ${validation.statistics}/${parserOutput.counts.statistics} statistics`);
    console.log(`✅ CLAUDE: Validated ${validation.caseStudies}/${parserOutput.counts.caseStudies} case studies`);
    
    return validation;
    
  } catch (error) {
    console.error('❌ CLAUDE ERROR:', error.message);
    // Fallback: use parser counts without validation
    return {
      expertQuotes: parserOutput.counts.expertQuotes,
      statistics: parserOutput.counts.statistics,
      sources: parserOutput.counts.sources,
      caseStudies: parserOutput.counts.caseStudies,
      faqCount: parserOutput.counts.faqCount,
      rejections: {
        expertQuotes: [],
        statistics: [],
        caseStudies: [],
      },
      fallback: true
    };
  }
}

/**
 * Build validation prompt based on HYBRID spec criteria
 */
function buildValidationPrompt(parserOutput) {
  // ======================= SAFETY CHECKS - ADDED HERE =======================
  // Safety check: ensure parserOutput has required structure
  if (!parserOutput) {
    console.warn('⚠️ CLAUDE: parserOutput is undefined/null');
    parserOutput = { counts: {}, snippets: {} };
  }
  
  // Ensure snippets object exists with all required arrays
  if (!parserOutput.snippets) {
    console.warn('⚠️ CLAUDE: parserOutput.snippets is missing');
    parserOutput.snippets = {
      expertQuotes: [],
      statistics: [],
      caseStudies: [],
      faqQuestions: []
    };
  }
  
  // Ensure counts object exists with all required fields
  if (!parserOutput.counts) {
    console.warn('⚠️ CLAUDE: parserOutput.counts is missing');
    parserOutput.counts = {
      expertQuotes: 0,
      statistics: 0,
      caseStudies: 0,
      faqCount: 0,
      sources: 0
    };
  }
  
  // Ensure each snippets array exists (can't be null/undefined)
  if (!Array.isArray(parserOutput.snippets.expertQuotes)) {
    console.warn('⚠️ CLAUDE: expertQuotes is not an array');
    parserOutput.snippets.expertQuotes = [];
  }
  if (!Array.isArray(parserOutput.snippets.statistics)) {
    console.warn('⚠️ CLAUDE: statistics is not an array');
    parserOutput.snippets.statistics = [];
  }
  if (!Array.isArray(parserOutput.snippets.caseStudies)) {
    console.warn('⚠️ CLAUDE: caseStudies is not an array');
    parserOutput.snippets.caseStudies = [];
  }
  if (!Array.isArray(parserOutput.snippets.faqQuestions)) {
    console.warn('⚠️ CLAUDE: faqQuestions is not an array');
    parserOutput.snippets.faqQuestions = [];
  }
  
  // Ensure count values are numbers (not undefined)
  if (typeof parserOutput.counts.expertQuotes !== 'number') {
    parserOutput.counts.expertQuotes = 0;
  }
  if (typeof parserOutput.counts.statistics !== 'number') {
    parserOutput.counts.statistics = 0;
  }
  if (typeof parserOutput.counts.caseStudies !== 'number') {
    parserOutput.counts.caseStudies = 0;
  }
  if (typeof parserOutput.counts.faqCount !== 'number') {
    parserOutput.counts.faqCount = 0;
  }
  if (typeof parserOutput.counts.sources !== 'number') {
    parserOutput.counts.sources = 0;
  }
  // ======================= END SAFETY CHECKS =======================
  
  console.log(`📊 CLAUDE: Data prepared - ${parserOutput.counts.expertQuotes} quotes, ${parserOutput.counts.statistics} stats`);
  
  return `You are a content quality validator for an SEO scoring system. Your task is to validate detected elements based on strict criteria. You can ONLY REJECT elements that don't meet criteria - you CANNOT ADD new elements.

# PARSER DETECTED:

## Expert Quotes (${parserOutput.counts.expertQuotes} detected):
${parserOutput.snippets.expertQuotes.map((q, i) => `${i+1}. ${q.text}`).join('\n')}

## Statistics (${parserOutput.counts.statistics} detected):
${parserOutput.snippets.statistics.slice(0, 15).map((s, i) => `${i+1}. ${s.text}`).join('\n')}

## Case Studies (${parserOutput.counts.caseStudies} detected):
${parserOutput.snippets.caseStudies.map((c, i) => `${i+1}. ${c.text}`).join('\n')}

## FAQ Questions (${parserOutput.counts.faqCount} detected):
${parserOutput.snippets.faqQuestions.slice(0, 10).map((faq, i) => `${i+1}. Q: ${faq.question}\n   A: ${faq.answer} (${faq.answerWords} words)`).join('\n')}

---

# VALIDATION CRITERIA:

## Expert Quotes - Must have:
1. Specific person name (first + last name, or recognizable public figure)
2. Title/function/organization mentioned
3. Actual quote (not paraphrase)
4. Relevant to the content topic

REJECT if:
- Generic attribution ("experts say", "studies show", "according to professionals")
- No specific name
- No title/organization
- Paraphrased statement instead of direct quote

## Statistics - Must have:
1. Clear source citation (organization, publication, year)
2. Specific number/percentage
3. Context that makes the stat meaningful
4. Verifiable (not made up)

REJECT if:
- No source mentioned
- Generic claim without numbers
- Obvious marketing fluff
- No year/date for the data

## Case Studies - Must have:
1. Specific company/client name (can be anonymized like "Company X" if explicitly a case study)
2. Concrete results with metrics (%, €, time, etc.)
3. Before/after or specific outcome
4. Not hypothetical ("could", "might", "would")

REJECT if:
- Generic example without specifics
- No measurable results
- Hypothetical scenario
- Just a testimonial without metrics

## FAQ Questions - Must have:
1. Actual question format (ends with ? or starts with what/how/why)
2. Substantial answer (50+ words minimum)
3. Directly answers the question
4. Relevant to content topic

REJECT if:
- Too short answer (<50 words)
- Doesn't actually answer the question
- Irrelevant to main topic

---

# RESPONSE FORMAT:

Return ONLY a JSON object (no markdown, no explanation):

{
  "expertQuotes": {
    "validated": <number>,
    "rejected": [
      {"index": <number>, "reason": "<brief reason>"}
    ]
  },
  "statistics": {
    "validated": <number>,
    "rejected": [
      {"index": <number>, "reason": "<brief reason>"}
    ]
  },
  "caseStudies": {
    "validated": <number>,
    "rejected": [
      {"index": <number>, "reason": "<brief reason>"}
    ]
  },
  "faqQuestions": {
    "validated": <number>,
    "rejected": [
      {"index": <number>, "reason": "<brief reason>"}
    ]
  }
}

IMPORTANT:
- Be strict but fair
- Reject anything that doesn't clearly meet ALL criteria
- validated + rejected.length should equal the detected count
- Use brief, specific rejection reasons
- Return ONLY the JSON object`;
}

/**
 * Parse Claude's validation response
 */
function parseValidationResponse(responseText) {
  try {
    // Remove markdown code blocks if present
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    
    const parsed = JSON.parse(cleanText);
    
    return {
      expertQuotes: parsed.expertQuotes.validated,
      statistics: parsed.statistics.validated,
      caseStudies: parsed.caseStudies.validated,
      faqCount: parsed.faqQuestions.validated,
      sources: parsed.expertQuotes.validated + parsed.statistics.validated, // Approximation
      rejections: {
        expertQuotes: parsed.expertQuotes.rejected || [],
        statistics: parsed.statistics.rejected || [],
        caseStudies: parsed.caseStudies.rejected || [],
        faqQuestions: parsed.faqQuestions.rejected || [],
      },
      fallback: false
    };
    
  } catch (error) {
    console.error('❌ Failed to parse Claude response:', error.message);
    console.error('Response was:', responseText);
    throw new Error('Invalid validation response format');
  }
}

// Export
module.exports = {
  validateContent,
};
