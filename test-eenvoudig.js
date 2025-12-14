// test-puppeteer-scanner.js
const { fetchWithPuppeteer, closeBrowser } = require('./src/puppeteer-fetcher');

console.log(`
🧪 TESTING PUPPETEER SCANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Test URLs
const testUrls = [
  'https://example.com',
  'https://contentscale.site'
];

async function runTest() {
  console.log(`📍 Testing: ${testUrls[1]}`);
  
  try {
    console.log('🚀 Starting browser...');
    
    // Test met Puppeteer
    const result = await fetchWithPuppeteer(testUrls[1], {
      timeout: 30000,
      waitUntil: 'networkidle0',
      waitDelay: 2000,
      screenshot: false
    });
    
    console.log('✅ Browser started');
    console.log('📥 Navigating to: https://contentscale.site');
    console.log('⏳ Waiting for content to load...');
    
    console.log(`✅ Fetch complete in ${result.duration}s`);
    console.log(`   📝 Word count: ${result.wordCount}`);
    console.log(`   📊 H1: ${result.metadata.h1Count}, H2: ${result.metadata.h2Count}`);
    console.log(`   🖼️  Images: ${result.metadata.imageCount}`);
    
    console.log('\n✅ FETCH SUCCESSFUL!');
    console.log('📊 RESULTS:');
    console.log(`   Word Count:    ${result.wordCount.toLocaleString()}`);
    console.log(`   Duration:      ${result.duration}s`);
    
    if (result.wordCount > 8000) {
      console.log(`
🎉 SUCCESS! ContentScale.site word count > 8000
   This proves Puppeteer is working correctly!
      `);
    } else if (result.wordCount > 1000) {
      console.log(`
✅ SUCCESS! Puppeteer is working
   Word count: ${result.wordCount}
      `);
    } else {
      console.log(`
⚠️  WARNING: Low word count detected
   This might indicate JavaScript wasn't fully rendered
   Word count: ${result.wordCount}
      `);
    }
    
    // Close browser
    await closeBrowser();
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    
    if (error.message.includes('waitForTimeout')) {
      console.log('\n🔧 FIX NEEDED:');
      console.log('   Puppeteer v24+ compatibility issue');
      console.log('   Update puppeteer-fetcher.js:');
      console.log('   Change: await page.waitForTimeout(waitDelay)');
      console.log('   To:     await new Promise(resolve => setTimeout(resolve, waitDelay))');
    }
    
    // Try to close browser anyway
    try {
      await closeBrowser();
    } catch (e) {
      // Ignore
    }
    
    process.exit(1);
  }
}

// Run test
runTest();