#!/usr/bin/env node
/*
 * Extract flattened language + dialect entries from public/data/data.json
 * Output: public/data/extracted_languages.json
 * Fields:
 *  - iso6393: string (top-level key)
 *  - dialect: string (dialect key)
 *  - name: human readable name (fallback chain: dialectObj.name || dialectObj.official_name || dialect key)
 *  - official_name
 *  - speakers
 *  - coordinates: { lat: number, lon: number }
 *  - voiceCount: number (voice_ids length)
 *  - hasVoices: boolean
 *  - voice_ids: string[] (kept for later processing)
 *  - createdAt: timestamp (ms) to trace pipeline versioning
 *
 * Usage: pnpm extract:languages
 */

const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const inputPath = join(root, 'public', 'data', 'data.json');
const outputPath = join(root, 'public', 'data', 'extracted_languages.json');

function loadJSON(path) {
  try {
    const raw = readFileSync(path, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load JSON at ${path}`, err);
    process.exit(1);
  }
}

function isValidCoordinate(value) {
  return (
    value &&
    typeof value.lat === 'number' &&
    typeof value.lon === 'number' &&
    Math.abs(value.lat) <= 90 &&
    Math.abs(value.lon) <= 180
  );
}

function extractLanguages(data) {
  const out = [];
  const now = Date.now();
  for (const iso6393 of Object.keys(data)) {
    const langBlock = data[iso6393];
    if (!langBlock || typeof langBlock !== 'object') continue;

    for (const dialectKey of Object.keys(langBlock)) {
      const dialectObj = langBlock[dialectKey];
      if (!dialectObj || typeof dialectObj !== 'object') continue;

      const coordinates = isValidCoordinate(dialectObj.coordinates)
        ? dialectObj.coordinates
        : null;

      const voice_ids = Array.isArray(dialectObj.voice_ids)
        ? dialectObj.voice_ids.filter(v => typeof v === 'string')
        : [];

      const entry = {
        iso6393,
        dialect: dialectKey,
        name: dialectObj.name || dialectObj.official_name || dialectKey,
        official_name: dialectObj.official_name || null,
        speakers: typeof dialectObj.speakers === 'number' ? dialectObj.speakers : null,
        coordinates,
        voiceCount: voice_ids.length,
        hasVoices: voice_ids.length > 0,
        voice_ids,
        createdAt: now
      };
      out.push(entry);
    }
  }
  return out.sort((a, b) => b.voiceCount - a.voiceCount || a.iso6393.localeCompare(b.iso6393));
}

function main() {
  console.log('Reading input:', inputPath);
  const data = loadJSON(inputPath);
  const flattened = extractLanguages(data);
  
  // Extract just the names for easy searching
  const names = flattened.map(entry => entry.name).filter(Boolean);
  const uniqueNames = [...new Set(names)].sort();
  
  // Write names to JSON file
  const namesOutputPath = join(root, 'public', 'data', 'language_names.json');
  writeFileSync(namesOutputPath, JSON.stringify(uniqueNames, null, 2));
  
  console.log(`Found ${uniqueNames.length} unique language names`);
  console.log(`Wrote names to: ${namesOutputPath}`);
}

main();
