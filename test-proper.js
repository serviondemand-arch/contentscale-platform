// ==========================================
// PROPER TEST voor puppeteer-fetcher.js
// ==========================================

console.log('🧪 PROPER TEST VAN puppeteer-fetcher.js\n');

// Import de ECHTE fetcher
const { fetchWithPuppeteer } = require('./src/puppeteer-fetcher');

async function runProperTest() {
  console.log('1. Testing with Wikipedia (reliable)...');
  
  try {
    const result = await fetchWithPuppeteer('https://www.wikipedia.org', {
      waitDelay: 1000,
      timeout: 15000
    });
    
    console.log('\n📊 TEST RESULTS:');
    console.log('   Success:', result.success);
    
    if (result.success) {
      console.log(`
✅ ALLES WERKT PERFECT!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Data fetched:
   Title: "${result.metadata.title}"
   Word Count: ${result.wordCount}
   Duration: ${result.duration.toFixed(1)}s
   H1 Headings: ${result.metadata.h1Count}
   H2 Headings: ${result.metadata.h2Count}
   Images: ${result.metadata.imageCount}
   Links: ${result.metadata.linkCount}
   
🎉 puppeteer-fetcher.js is ready for ContentScale!
`);
    } else {
      console.log('❌ Fetch failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run test
runProperTest();