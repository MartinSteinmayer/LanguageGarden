#!/usr/bin/env node
/*
 * Fetch Wikipedia descriptions for languages from language_names.json
 * Output: public/data/descriptions.json
 * Usage: pnpm enrich:descriptions
 */

const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const https = require('node:https');

const root = join(__dirname, '..');
const inputPath = join(root, 'public', 'data', 'language_names.json');
const outputPath = join(root, 'public', 'data', 'descriptions.json');
const cachePath = join(root, '.cache', 'wikipedia-progress.json');

function loadJSON(path) {
  try {
    const raw = readFileSync(path, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load JSON at ${path}`, err);
    process.exit(1);
  }
}

function saveJSON(path, data) {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed to write JSON to ${path}`, err);
    process.exit(1);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchWikipediaPage(query) {
  return new Promise((resolve, reject) => {
    // Try searching for the language name + "language" to get better results
    const searchTerms = [
      query + ' language',
      query,
      query.replace(/\s+/g, '_')
    ];

    function trySearch(termIndex = 0) {
      if (termIndex >= searchTerms.length) {
        resolve({ extract: null, url: null });
        return;
      }

      const term = encodeURIComponent(searchTerms[termIndex]);
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${term}`;
      
      const req = https.get(url, {
        headers: {
          'User-Agent': 'LanguageGarden/1.0 (https://github.com/MartinSteinmayer/LanguageGarden)'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.extract && parsed.extract.length > 50) {
              resolve({
                extract: parsed.extract,
                url: parsed.content_urls?.desktop?.page || null
              });
            } else {
              // Try next search term
              trySearch(termIndex + 1);
            }
          } catch (err) {
            trySearch(termIndex + 1);
          }
        });
      });

      req.on('error', () => {
        trySearch(termIndex + 1);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        trySearch(termIndex + 1);
      });
    }

    trySearch();
  });
}

async function main() {
  console.log('Reading language names from:', inputPath);
  const languageNames = loadJSON(inputPath);
  
  // Load existing progress if available
  let descriptions = [];
  let processedNames = new Set();
  
  if (existsSync(outputPath)) {
    descriptions = loadJSON(outputPath);
    processedNames = new Set(descriptions.map(d => d.name));
    console.log(`Resuming from ${descriptions.length} existing descriptions`);
  }

  console.log(`Processing ${languageNames.length} languages...`);
  
  for (let i = 0; i < languageNames.length; i++) {
    const name = languageNames[i];
    
    if (processedNames.has(name)) {
      console.log(`${i + 1}/${languageNames.length} Skipping ${name} (already processed)`);
      continue;
    }

    console.log(`${i + 1}/${languageNames.length} Fetching ${name}...`);
    
    try {
      const result = await fetchWikipediaPage(name);
      
      descriptions.push({
        name: name,
        description: result.extract || `No description found for ${name}`,
        url: result.url,
        fetchedAt: Date.now()
      });

      // Save progress every 10 languages
      if (descriptions.length % 10 === 0) {
        saveJSON(outputPath, descriptions);
        console.log(`Saved progress: ${descriptions.length} descriptions`);
      }

      // Rate limiting: 500ms between requests
      await delay(500);
      
    } catch (err) {
      console.error(`Error fetching ${name}:`, err.message);
      descriptions.push({
        name: name,
        description: `Error fetching description for ${name}`,
        url: null,
        fetchedAt: Date.now()
      });
    }
  }

  // Final save
  saveJSON(outputPath, descriptions);
  console.log(`\nCompleted! Wrote ${descriptions.length} descriptions to ${outputPath}`);
}

main().catch(console.error);
