// ==========================================
// SIMPLE PUPPETEER TEST
// Test of Puppeteer werkt
// ==========================================

console.log(`
🧪 SIMPLE PUPPETEER TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

const puppeteer = require('puppeteer');

async function runTest() {
  let browser;
  
  try {
    console.log('🚀 Starting browser...');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('✅ Browser started');
    
    const page = await browser.newPage();
    console.log('📥 Navigating to: https://example.com');
    
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('⏳ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const title = await page.title();
    const content = await page.content();
    const wordCount = content.split(/\s+/).length;
    
    console.log(`
✅ TEST SUCCESSFUL!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESULTS:
   Title:       "${title}"
   Word Count:  ${wordCount}
   URL:         https://example.com
   
🎉 Puppeteer is working correctly!
`);
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    
    if (error.message.includes('waitForTimeout')) {
      console.log('\n🔧 FIX NEEDED:');
      console.log('   Puppeteer v24+ heeft waitForTimeout() verwijderd');
      console.log('   Gebruik in plaats daarvan:');
      console.log('   await new Promise(resolve => setTimeout(resolve, delay));');
    }
    
  } finally {
    // Close browser
    if (browser) {
      try {
        await browser.close();
        console.log('🔒 Browser closed');
      } catch (e) {
        console.log('⚠️  Error closing browser:', e.message);
      }
    }
  }
}

// Run test
runTest();// Test file 
