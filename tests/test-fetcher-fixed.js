// test-fetcher-fixed.js - WERKENDE VERSIE
console.log('=== TEST PUPPETEER-FETCHER ===');

// Stap 1: Check of puppeteer-fetcher.js bestaat
const fs = require('fs');
const path = './src/puppeteer-fetcher.js';

if (!fs.existsSync(path)) {
  console.log('❌ puppeteer-fetcher.js bestaat niet!');
  console.log('Maak het eerst met: notepad src\\puppeteer-fetcher.js');
  process.exit(1);
}

// Stap 2: Lees wat erin staat
console.log('📄 Inhoud puppeteer-fetcher.js:');
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Toon eerste 15 regels
for (let i = 0; i < Math.min(15, lines.length); i++) {
  console.log(`${i+1}: ${lines[i]}`);
}

// Stap 3: Check of fetchWithPuppeteer erin staat
if (content.includes('fetchWithPuppeteer')) {
  console.log('✅ fetchWithPuppeteer gevonden in bestand');
  
  // Stap 4: Probeer te importeren
  try {
    const fetcher = require('./src/puppeteer-fetcher');
    console.log('✅ Module succesvol geladen');
    
    // Check exports
    const exports = Object.keys(fetcher);
    console.log(`📦 Exports: ${exports.join(', ')}`);
    
    if (fetcher.fetchWithPuppeteer) {
      console.log('🎉 fetchWithPuppeteer functie bestaat!');
      
      // Test de functie
      console.log('\n🚀 Testing fetchWithPuppeteer...');
      fetcher.fetchWithPuppeteer('https://www.wikipedia.org', { 
        waitDelay: 1000,
        timeout: 15000 
      })
      .then(result => {
        console.log('\n📊 RESULT:');
        console.log(`   Success: ${result.success}`);
        
        if (result.success) {
          console.log(`   Title: "${result.metadata?.title || 'Unknown'}"`);
          console.log(`   Words: ${result.wordCount}`);
          console.log(`   H1: ${result.metadata?.h1Count || 0}`);
          console.log('✅ ALLES WERKT!');
        } else {
          console.log(`   Error: ${result.error}`);
        }
      })
      .catch(error => {
        console.error('❌ Exception:', error.message);
      });
      
    } else {
      console.log('❌ fetchWithPuppeteer is undefined in module');
      console.log('Module bevat:', Object.keys(fetcher));
    }
    
  } catch (importError) {
    console.error('❌ Kan module niet laden:', importError.message);
    
    // Toon foutregel
    if (importError.message.includes('waitForTimeout')) {
      console.log('\n🔧 OPLOSSING:');
      console.log('Vervang in puppeteer-fetcher.js:');
      console.log('   await page.waitForTimeout(waitDelay);');
      console.log('Met:');
      console.log('   if (waitDelay > 0) {');
      console.log('     await new Promise(resolve => setTimeout(resolve, waitDelay));');
      console.log('   }');
    }
  }
  
} else {
  console.log('❌ fetchWithPuppeteer NIET gevonden in bestand');
  console.log('\n📝 Maak een nieuwe puppeteer-fetcher.js:');
  console.log('1. notepad src\\puppeteer-fetcher.js');
  console.log('2. Plak de werkende code');
  console.log('3. Save');
}