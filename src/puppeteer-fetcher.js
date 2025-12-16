// ==========================================
// PUPPETEER FETCHER - FIXED VERSION
// With browser pooling and proper cleanup
// ==========================================

const puppeteer = require('puppeteer');

// Browser instance pooling
let browserInstance = null;
let browserLaunchPromise = null;
const MAX_PAGES = 5;
let activePages = 0;

/**
 * Get or create browser instance (pooling)
 */
async function getBrowser() {
  // If browser is already launching, wait for it
  if (browserLaunchPromise) {
    return browserLaunchPromise;
  }
  
  // If browser exists and is connected, return it
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }
  
  // Launch new browser
  console.log('🚀 Launching browser...');
  
  browserLaunchPromise = puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  }).then(browser => {
    browserInstance = browser;
    browserLaunchPromise = null;
    console.log('✅ Browser launched successfully');
    return browser;
  }).catch(error => {
    browserLaunchPromise = null;
    throw error;
  });
  
  return browserLaunchPromise;
}

/**
 * Fetch page content with Puppeteer
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @returns {object} - Fetch result with HTML content
 */
async function fetchWithPuppeteer(url, options = {}) {
  const {
    timeout = 30000,
    waitUntil = 'networkidle2',
    waitDelay = 2000
  } = options;
  
  const startTime = Date.now();
  let page = null;
  
  try {
    // Validate URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with http:// or https://');
    }
    
    console.log(`🌐 Fetching: ${url}`);
    
    // Check if we can create new page
    if (activePages >= MAX_PAGES) {
      throw new Error('Too many concurrent pages. Please wait.');
    }
    
    // Get browser
    const browser = await getBrowser();
    
    // Create new page
    page = await browser.newPage();
    activePages++;
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ 
      width: 1920, 
      height: 1080 
    });
    
    // Block only heavy resources (images, video, media)
    // Keep CSS and JS for proper rendering!
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      const url = req.url();
      
      // Block only heavy media files
      if (resourceType === 'image' || 
          resourceType === 'media' || 
          resourceType === 'font' ||
          url.includes('.mp4') ||
          url.includes('.webm') ||
          url.includes('.avi')) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    // Set timeout for navigation
    page.setDefaultTimeout(timeout);
    
    // Navigate to URL
    console.log(`📥 Navigating to: ${url}`);
    await page.goto(url, {
      waitUntil: waitUntil,
      timeout: timeout
    });
    
    // Wait for content to settle
    if (waitDelay > 0) {
      console.log(`⏳ Waiting ${waitDelay}ms for content to load...`);
      await new Promise(resolve => setTimeout(resolve, waitDelay));
    }
    
    // Scroll page to trigger lazy loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    
    // Get full HTML content
    const htmlContent = await page.content();
    
    // Validate content
    if (!htmlContent || htmlContent.length < 100) {
      throw new Error('Page content is too small or empty');
    }
    
    // Extract text content
    const textContent = await page.evaluate(() => {
      // Remove script and style tags
      const clone = document.body.cloneNode(true);
      const scripts = clone.querySelectorAll('script, style, noscript');
      scripts.forEach(el => el.remove());
      
      return clone.innerText || clone.textContent || '';
    });
    
    // Calculate word count
    const words = textContent
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    const wordCount = words.length;
    
    // Extract metadata
    const metadata = await page.evaluate(() => {
      return {
        title: document.title || '',
        h1Count: document.querySelectorAll('h1').length,
        h2Count: document.querySelectorAll('h2').length,
        h3Count: document.querySelectorAll('h3').length,
        imageCount: document.querySelectorAll('img').length,
        linkCount: document.querySelectorAll('a').length,
        description: document.querySelector('meta[name="description"]')?.content || '',
        keywords: document.querySelector('meta[name="keywords"]')?.content || '',
        ogTitle: document.querySelector('meta[property="og:title"]')?.content || '',
        ogDescription: document.querySelector('meta[property="og:description"]')?.content || '',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        language: document.documentElement.lang || '',
        viewport: document.querySelector('meta[name="viewport"]')?.content || ''
      };
    });
    
    const duration = (Date.now() - startTime) / 1000;
    
    // Close page BEFORE returning
    await page.close();
    activePages--;
    page = null;
    
    console.log(`✅ Fetch complete: ${wordCount} words in ${duration.toFixed(1)}s`);
    
    return {
      success: true,
      url: url,
      html: htmlContent,
      content: htmlContent,
      textContent: textContent,
      wordCount: wordCount,
      metadata: metadata,
      duration: duration,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ Fetch error for ${url}:`, error.message);
    
    // Clean up page on error
    if (page) {
      try {
        await page.close();
        activePages--;
      } catch (closeError) {
        console.error('Error closing page:', closeError.message);
      }
    }
    
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}

/**
 * Close browser instance (for graceful shutdown)
 */
async function closeBrowser() {
  if (browserInstance) {
    console.log('🛑 Closing browser...');
    try {
      await browserInstance.close();
      browserInstance = null;
      browserLaunchPromise = null;
      activePages = 0;
      console.log('✅ Browser closed');
    } catch (error) {
      console.error('Error closing browser:', error.message);
    }
  }
}

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await closeBrowser();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received');
  await closeBrowser();
  process.exit(0);
});

module.exports = {
  fetchWithPuppeteer,
  closeBrowser
};
