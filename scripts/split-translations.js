const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const localesDir = path.join(__dirname, '../public/locales');

// 1. Find all translation keys used in the codebase and map them to their files
const keyUsageMap = {};

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const regex = /dict\.(?:\[["']([^"']+)["']\]|([a-zA-Z0-9_]+))/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const key = match[1] || match[2];
        if (!keyUsageMap[key]) {
          keyUsageMap[key] = new Set();
        }
        
        // Determine logical "page" or component category
        // If it's in src/app/[lang]/(main)/[page], it belongs to that page.
        // If it's in src/components/..., it might be shared. We can just use the filename as the bucket.
        let bucket = 'misc';
        const relativePath = path.relative(path.join(__dirname, '../src/app'), fullPath);
        
        if (relativePath.includes('(main)')) {
          const parts = relativePath.split(path.sep);
          const mainIdx = parts.indexOf('(main)');
          if (mainIdx !== -1 && parts.length > mainIdx + 1) {
            const possiblePage = parts[mainIdx + 1];
            if (possiblePage.endsWith('.tsx')) {
              bucket = 'home'; // Root page
            } else {
              bucket = possiblePage;
            }
          }
        } else if (relativePath.startsWith('components')) {
            bucket = 'components';
        }
        
        keyUsageMap[key].add(bucket);
      }
    }
  }
}

scanDirectory(srcDir);

// 2. Load EN dictionary to check word counts for 'misc'
const enDictPath = path.join(localesDir, 'en.json');
if (!fs.existsSync(enDictPath)) {
  console.error("en.json not found!");
  process.exit(1);
}
const enDict = JSON.parse(fs.readFileSync(enDictPath, 'utf8'));

// Determine the final bucket for each key
const keyToBucket = {};
for (const key of Object.keys(enDict)) {
  const usages = keyUsageMap[key] ? Array.from(keyUsageMap[key]) : [];
  const text = enDict[key];
  
  if (typeof text !== 'string') {
    keyToBucket[key] = 'misc';
    continue;
  }
  
  const wordCount = text.trim().split(/\s+/).length;
  
  if (usages.length === 0) {
    keyToBucket[key] = 'misc';
  } else if (usages.length > 1) {
    keyToBucket[key] = 'misc';
  } else if (wordCount <= 2) {
    keyToBucket[key] = 'misc';
  } else {
    const bucket = usages[0] === 'components' ? 'misc' : usages[0];
    keyToBucket[key] = bucket;
  }
}

// 3. Process each language file
const langs = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];

for (const lang of langs) {
  const langFilePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(langFilePath)) continue;
  
  const dict = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
  
  // Group keys by bucket
  const buckets = {};
  for (const [key, value] of Object.entries(dict)) {
    const bucketName = keyToBucket[key] || 'misc';
    if (!buckets[bucketName]) buckets[bucketName] = {};
    buckets[bucketName][key] = value;
  }
  
  // Create dir
  const langDir = path.join(localesDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  
  // Write files
  for (const [bucketName, keys] of Object.entries(buckets)) {
    const bucketFilePath = path.join(langDir, `${bucketName}.json`);
    fs.writeFileSync(bucketFilePath, JSON.stringify(keys, null, 2), 'utf8');
  }
  
  // Delete original file
  fs.unlinkSync(langFilePath);
  console.log(`Split ${lang}.json into ${Object.keys(buckets).length} files.`);
}

console.log('Successfully split translation files!');
