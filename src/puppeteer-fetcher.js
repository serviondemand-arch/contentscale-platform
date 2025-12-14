const puppeteer = require('puppeteer');

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
    
    // Validate URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with http:// or https://');
    }
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ],
      timeout: timeout
    });
    
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (resourceType === 'image' || resourceType === 'font' || resourceType === 'stylesheet') {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    // Navigate to URL
    await page.goto(url, {
      waitUntil: waitUntil,
      timeout: timeout
    });
    
    // Wait additional time
    if (waitDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, waitDelay));
    }
    
    // Get page content
    const htmlContent = await page.content();
    
    // Check if content is valid
    if (!htmlContent || htmlContent.length < 100) {
      throw new Error('Page content is too small or empty');
    }
    
    // Extract text for word count
    const textContent = await page.evaluate(() => {
      return document.body.innerText || '';
    });
    
    // Calculate word count
    const wordCount = textContent
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
    
    // Extract metadata
    const metadata = await page.evaluate(() => {
      return {
        title: document.title || '',
        h1Count: document.querySelectorAll('h1').length,
        h2Count: document.querySelectorAll('h2').length,
        imageCount: document.querySelectorAll('img').length,
        linkCount: document.querySelectorAll('a').length,
        description: document.querySelector('meta[name="description"]')?.content || '',
        keywords: document.querySelector('meta[name="keywords"]')?.content || '',
        ogTitle: document.querySelector('meta[property="og:title"]')?.content || '',
        ogDescription: document.querySelector('meta[property="og:description"]')?.content || '',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        language: document.documentElement.lang || '',
        url: window.location.href
      };
    });
    
    const duration = (Date.now() - startTime) / 1000;
    
    console.log(`✅ Fetched ${url} (${duration.toFixed(1)}s, ${wordCount} words)`);
    
    return {
      success: true,
      url: url,
      content: htmlContent,
      html: htmlContent,
      textContent: textContent,
      wordCount: wordCount,
      metadata: metadata,
      duration: duration,
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
      content: '',
      html: '',
      textContent: '',
      wordCount: 0,
      metadata: {},
      error: error.message,
      duration: (Date.now() - startTime) / 1000,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { fetchWithPuppeteer };
