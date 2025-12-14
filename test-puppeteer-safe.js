// ==========================================
// SIMPLE PUPPETEER TEST - SAFE VERSION
// ==========================================

console.log(`
🧪 TEST PUPPETEER (SAFE VERSION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

const puppeteer = require('puppeteer');

async function testPuppeteer() {
  let browser;
  
  try {
    console.log('1. 🚀 Testing browser launch...');
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('   ✅ Browser launched!');
    
    console.log('2. 📄 Testing page creation...');
    const page = await browser.newPage();
    console.log('   ✅ Page created!');
    
    console.log('3. 🌐 Testing navigation...');
    
    // Try multiple URLs
    const testUrls = [
      'https://www.wikipedia.org',
      'https://www.google.com',
      'http://localhost:3000'
    ];
    
    let success = false;
    
    for (const url of testUrls) {
      try {
        console.log(`   Trying: ${url}`);
        await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        const title = await page.title();
        console.log(`   ✅ SUCCESS with ${url}`);
        console.log(`      Title: "${title}"`);
        success = true;
        break;
        
      } catch (urlError) {
        console.log(`   ❌ ${url} failed: ${urlError.message}`);
        continue;
      }
    }
    
    if (!success) {
      // Test offline
      console.log('   🔄 Testing offline capabilities...');
      await page.goto('about:blank');
      await page.setContent('<h1>Offline Test</h1><p>Puppeteer works!</p>');
      const content = await page.content();
      console.log(`   ✅ Offline test successful (${content.length} bytes)`);
    }
    
    console.log('\n🎉 PUPPETEER TEST COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Puppeteer is correctly installed');
    console.log('✅ Browser can be launched');
    console.log('✅ Pages can be created');
    console.log('✅ Ready for ContentScale platform!');
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error.message);
    
    // Check for common issues
    if (error.message.includes('waitForTimeout')) {
      console.log('\n🔧 SOLUTION:');
      console.log('   Puppeteer v24 removed waitForTimeout()');
      console.log('   Use this instead:');
      console.log('   await new Promise(r => setTimeout(r, delay));');
    }
    
    if (error.message.includes('Could not find browser')) {
      console.log('\n🔧 SOLUTION:');
      console.log('   Run: npm install');
      console.log('   Puppeteer needs to download Chrome');
    }
    
  } finally {
    if (browser) {
      await browser.close();
      console.log('\n🔒 Browser closed');
    }
  }
}

// Run test
testPuppeteer();