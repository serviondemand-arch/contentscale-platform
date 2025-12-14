// test-simple.js
console.log('🧪 Testing Puppeteer v24...');

(async () => {
  try {
    const puppeteer = require('puppeteer');
    console.log('✅ Puppeteer loaded');
    
    // Check version via package.json
    const pkg = require('puppeteer/package.json');
    console.log(`📦 Version: ${pkg.version}`);
    
    // Launch browser
    console.log('🚀 Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('✅ Browser launched');
    
    const page = await browser.newPage();
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded');
    
    // Use Promise instead of waitForTimeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const title = await page.title();
    console.log(`📄 Title: ${title}`);
    
    const text = await page.evaluate(() => document.body.innerText || '');
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    console.log(`📊 Word count: ${wordCount}`);
    
    await browser.close();
    console.log('🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
})();