// test-puppeteer-simple.js
console.log('🧪 SIMPLE PUPPETEER TEST');

const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('1. ✅ Puppeteer loaded');
    
    // Launch browser
    console.log('2. 🚀 Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('3. ✅ Browser launched');
    
    // Create page
    const page = await browser.newPage();
    
    // Go to example.com
    console.log('4. 📥 Navigating to https://example.com...');
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('5. ✅ Page loaded');
    
    // Wait 1 second (gebruik Promise ipv waitForTimeout)
    console.log('6. ⏳ Waiting 1 second...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get page title
    const title = await page.title();
    console.log(`7. 📄 Page title: ${title}`);
    
    // Count words
    const text = await page.evaluate(() => {
      return document.body.innerText || '';
    });
    const words = text.split(/\s+/).filter(w => w.length > 0);
    console.log(`8. 📊 Word count: ${words.length}`);
    
    // Close browser
    await browser.close();
    console.log('9. ✅ Browser closed');
    
    console.log('\n🎉 TEST SUCCESSFUL! Puppeteer works!');
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    
    if (error.message.includes('waitForTimeout')) {
      console.log('\n🔧 FIX NEEDED IN puppeteer-fetcher.js:');
      console.log('Vervang: await page.waitForTimeout(waitDelay)');
      console.log('Met:     await new Promise(resolve => setTimeout(resolve, waitDelay))');
    }
  }
})();