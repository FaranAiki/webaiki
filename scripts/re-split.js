const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const langs = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];

const patternToBucket = [
  { test: (k) => k.includes('Project') || k.includes('UAS') || k.includes('Nihwm') || k.includes('Alkyl') || k.includes('Jump_Game') || k.includes('Below_Below') || k.includes('Olive_Divergence') || k.includes('Superskill') || k.includes('National_Statistics_Competition'), bucket: 'project' },
  { test: (k) => k.includes('Module_Author') || k.includes('Intern') || k.includes('Freelance') || k.includes('Work') || k.includes('Analitica') || k.includes('Kobi') || k.includes('Developer') || k.includes('Tutor') || k.includes('Software_Engineer') || k.includes('Education_Team'), bucket: 'work' },
  { test: (k) => k.includes('NBK') || k.includes('Organization') || k.includes('HMIF') || k.includes('Committee') || k.includes('Wisokto') || k.includes('Impact_Web_Lead') || k.includes('Treasurer_') || k.includes('_Club') || k.includes('PARAS') || k.includes('Concerto') || k.includes('GDG') || k.includes('Student_Club'), bucket: 'organization' },
  { test: (k) => k.includes('Faran_') || k.includes('Philosophy') || k.includes('Principle') || k.includes('Vision'), bucket: 'identity' },
  { test: (k) => k.includes('Sultan_PDF') || k.includes('Portfolio') || k.includes('Skills_'), bucket: 'portfolio' },
  { test: (k) => /FI\d{4}|WI\d{4}|MA\d{4}|IF\d{4}|II\d{4}|KI\d{4}/.test(k) || k.includes('Semester') || k.includes('Education_ITB') || k.includes('Education_SMA') || k.includes('Transcript_') || k.includes('Course_') || k.includes('ITB'), bucket: 'college' },
  { test: (k) => k.includes('Poem') || k.includes('Short_Story') || k.includes('Essay'), bucket: 'literature' },
  { test: (k) => k.includes('gemini_'), bucket: 'home' },
  { test: (k) => k.includes('News_') || k.includes('Activity'), bucket: 'news' },
  { test: (k) => k.includes('Award') || k.includes('Scholarship') || k.includes('ONMIPA') || k.includes('Paragon'), bucket: 'award' },
];

for (const lang of langs) {
  const langDir = path.join(localesDir, lang);
  if (!fs.existsSync(langDir)) continue;

  const files = fs.readdirSync(langDir);
  let miscDict = {};
  for (const file of files) {
    if (file.startsWith('misc-') && file.endsWith('.json')) {
      const filePath = path.join(langDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      Object.assign(miscDict, JSON.parse(content));
      fs.unlinkSync(filePath); // delete old misc files
    }
  }

  if (Object.keys(miscDict).length === 0) continue;

  const remainingMiscKeys = [];

  for (const [key, value] of Object.entries(miscDict)) {
    let matchedBucket = null;
    for (const rule of patternToBucket) {
      if (rule.test(key)) {
        matchedBucket = rule.bucket;
        break;
      }
    }

    if (matchedBucket) {
      const bucketPath = path.join(langDir, `${matchedBucket}.json`);
      let bucketDict = {};
      if (fs.existsSync(bucketPath)) {
        bucketDict = JSON.parse(fs.readFileSync(bucketPath, 'utf8'));
      }
      bucketDict[key] = value;
      fs.writeFileSync(bucketPath, JSON.stringify(bucketDict, null, 2), 'utf8');
    } else {
      remainingMiscKeys.push(key);
    }
  }

  // Chunk remaining misc keys
  let chunkIndex = 1;
  let currentChunk = {};
  for (let i = 0; i < remainingMiscKeys.length; i++) {
    const key = remainingMiscKeys[i];
    currentChunk[key] = miscDict[key];

    if (Object.keys(currentChunk).length >= 100) {
      fs.writeFileSync(path.join(langDir, `misc-${chunkIndex}.json`), JSON.stringify(currentChunk, null, 2), 'utf8');
      currentChunk = {};
      chunkIndex++;
    }
  }
  if (Object.keys(currentChunk).length > 0) {
    fs.writeFileSync(path.join(langDir, `misc-${chunkIndex}.json`), JSON.stringify(currentChunk, null, 2), 'utf8');
  }



  console.log(`Processed ${lang}`);
}

console.log('Re-split completed.');
