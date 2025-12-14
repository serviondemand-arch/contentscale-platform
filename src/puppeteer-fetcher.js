// ==========================================
// puppeteer-fetcher.js - DE ECHTE FETCHER
// Voor ContentScale Platform
// ==========================================

const puppeteer = require('puppeteer');

/**
 * Fetch webpage content using Puppeteer
 * @param {string} url - URL to fetch
 * @param {Object} options - Optional settings
 * @returns {Promise<Object>} - Fetch result with content and metadata
 */
async function fetchWithPuppeteer(url, options = {}) {
  const {
    timeout = 30000,
    waitUntil = 'networkidle2',
    waitDelay = 2000,
    screenshot = false
  } = options;
  
  let browser = null;
  const startTime = Date.now();
  
  try {
    console.log(`🌐 Fetching: ${url}`);
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    
    // Navigate to URL
    await page.goto(url, {
      waitUntil: waitUntil,
      timeout: timeout
    });
    
    // Wait additional time if needed - USING setTimeout (NOT waitForTimeout)
    if (waitDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, waitDelay));
    }
    
    // Get page content
    const htmlContent = await page.content();
    
    // Extract metadata
    const metadata = await page.evaluate(() => {
      return {
        title: document.title || '',
        h1Count: document.querySelectorAll('h1').length,
        h2Count: document.querySelectorAll('h2').length,
        imageCount: document.querySelectorAll('img').length,
        linkCount: document.querySelectorAll('a').length,
        description: document.querySelector('meta[name="description"]')?.content || '',
        keywords: document.querySelector('meta[name="keywords"]')?.content || ''
      };
    });
    
    // Extract text for word count
    const textContent = await page.evaluate(() => {
      return document.body.innerText || '';
    });
    
    // Calculate word count
    const wordCount = textContent
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
    
    // Take screenshot if requested
    let screenshotBuffer = null;
    if (screenshot) {
      screenshotBuffer = await page.screenshot({
        type: 'jpeg',
        quality: 80
      });
    }
    
    const duration = (Date.now() - startTime) / 1000;
    
    console.log(`✅ Fetched ${url} (${duration.toFixed(1)}s, ${wordCount} words)`);
    
    return {
      success: true,
      url: url,
      content: htmlContent,
      textContent: textContent,
      wordCount: wordCount,
      metadata: metadata,
      duration: duration,
      screenshot: screenshotBuffer,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error.message);
    
    // Try to close browser on error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        // Ignore close errors
      }
    }
    
    return {
      success: false,
      url: url,
      error: error.message,
      duration: (Date.now() - startTime) / 1000,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Legacy function for compatibility
 */
async function closeBrowser() {
  console.log('⚠️ closeBrowser() is deprecated - browsers auto-close');
  return Promise.resolve();
}

// Export functions
module.exports = {
  fetchWithPuppeteer,
  closeBrowser
};