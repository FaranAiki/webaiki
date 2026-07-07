const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const defaultDict = {
  "Transcript_TPB": "First Year Program",
  "Transcript_Tahap_Sarjana": "Bachelor Program"
};

const idDict = {
  "Transcript_TPB": "Tahap Persiapan Bersama",
  "Transcript_Tahap_Sarjana": "Tahap Sarjana"
};

langs.forEach(lang => {
  const targetDict = lang === 'id' ? idDict : defaultDict;
  const filePath = path.join(localesDir, lang, 'misc-3.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;
    for (const [key, val] of Object.entries(targetDict)) {
      if (data[key] !== val) {
        data[key] = val;
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Updated ${lang}/misc-3.json again`);
    }
  }
});
