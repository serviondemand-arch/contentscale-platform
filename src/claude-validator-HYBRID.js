// ==========================================
// CLAUDE VALIDATOR - HYBRID SYSTEM
// Quality validation using Claude AI
// ==========================================

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Validate content quality using Claude AI
 * This is STEP 3 of the hybrid pipeline
 * 
 * @param {object} parserOutput - Output from content parser
 * @returns {object} - Validated counts
 */
async function validateContent(parserOutput) {
  console.log('🤖 Claude validation starting...');
  
  try {
    // Prepare validation prompt
    const prompt = buildValidationPrompt(parserOutput);
    
    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    // Parse Claude's response
    const responseText = message.content[0].text;
    const validation = parseValidationResponse(responseText);
    
    console.log('✅ Claude validation complete');
    
    return {
      // Return validated counts (or original if Claude didn't reject)
      expertQuotes: validation.expertQuotes !== undefined ? validation.expertQuotes : parserOutput.counts.expertQuotes,
      statistics: validation.statistics !== undefined ? validation.statistics : parserOutput.counts.statistics,
      caseStudies: validation.caseStudies !== undefined ? validation.caseStudies : parserOutput.counts.caseStudies,
      
      // Pass through other counts unchanged
      ...parserOutput.counts,
      
      // Store rejections
      rejections: validation.rejections || {}
    };
    
  } catch (error) {
    console.error('⚠️ Claude validation error:', error.message);
    console.log('ℹ️ Falling back to parser counts without validation');
    
    // Return parser counts without validation
    return {
      ...parserOutput.counts,
      rejections: {
        error: 'Claude validation failed, using parser counts'
      }
    };
  }
}

function buildValidationPrompt(parserOutput) {
  const { counts, snippets } = parserOutput;
  
  return `You are a quality validator for SEO content analysis. Review the detected elements and validate their quality.

PARSER DETECTED:
- Expert Quotes: ${counts.expertQuotes}
- Statistics: ${counts.statistics}
- Case Studies: ${counts.caseStudies}

SAMPLES:

Expert Quotes:
${snippets.expertQuotes.map((q, i) => `${i + 1}. "${q.text}" - ${q.attribution}`).join('\n')}

Statistics:
${snippets.statistics.map((s, i) => `${i + 1}. ${s.value} (Source: ${s.hasSource ? 'Yes' : 'No'})`).join('\n')}

Case Studies:
${snippets.caseStudies.map((c, i) => `${i + 1}. ${c}`).join('\n')}

VALIDATION CRITERIA:

Expert Quotes - VALID if:
1. Has a real person's name (first + last)
2. Has a title/position/company
3. Is an actual quote (not paraphrase)

Statistics - VALID if:
1. Has a clear number/percentage
2. Has a source citation nearby
3. Not just generic numbers

Case Studies - VALID if:
1. Names a specific company/person
2. Includes concrete results (%, €, timeframe)
3. Not hypothetical ("could", "might")

Respond ONLY with JSON:
{
  "expertQuotes": <number of VALID quotes>,
  "statistics": <number of VALID statistics>,
  "caseStudies": <number of VALID case studies>,
  "rejections": {
    "expertQuotes": ["reason for rejection 1", ...],
    "statistics": ["reason for rejection 1", ...],
    "caseStudies": ["reason for rejection 1", ...]
  }
}`;
}

function parseValidationResponse(responseText) {
  try {
    // Try to extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, return empty validation
    return {
      rejections: {
        parsing: 'Could not parse Claude response'
      }
    };
    
  } catch (error) {
    console.error('Error parsing Claude response:', error.message);
    return {
      rejections: {
        parsing: error.message
      }
    };
  }
}

module.exports = {
  validateContent
};
