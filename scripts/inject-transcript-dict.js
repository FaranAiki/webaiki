const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const defaultDict = {
  "Transcript_IP": "GPA:",
  "Transcript_Passed_Credits": "Passed Credits:",
  "Transcript_No": "No",
  "Transcript_Code": "Code",
  "Transcript_Course": "Course",
  "Transcript_Type": "Type",
  "Transcript_Credits": "Credits",
  "Transcript_Grade": "Grade",
  "Transcript_Semester": "Taken Semester",
  "Transcript_Grade_Conversion": "Grade Conversion",
  "Transcript_Tahap_Persiapan_Bersama": "First Year Program",
  "Transcript_Tahap_Sarjana": "Bachelor Program"
};

const idDict = {
  "Transcript_IP": "IP:",
  "Transcript_Passed_Credits": "SKS Lulus:",
  "Transcript_No": "No",
  "Transcript_Code": "Kode",
  "Transcript_Course": "Mata Kuliah",
  "Transcript_Type": "Sifat",
  "Transcript_Credits": "SKS",
  "Transcript_Grade": "Nilai",
  "Transcript_Semester": "Semester",
  "Transcript_Grade_Conversion": "Konversi Nilai",
  "Transcript_Tahap_Persiapan_Bersama": "Tahap Persiapan Bersama",
  "Transcript_Tahap_Sarjana": "Tahap Sarjana"
};

langs.forEach(lang => {
  const targetDict = lang === 'id' ? idDict : defaultDict;
  const filePath = path.join(localesDir, lang, 'misc-3.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;
    for (const [key, val] of Object.entries(targetDict)) {
      if (!data[key]) {
        data[key] = val;
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Updated ${lang}/misc-3.json`);
    }
  }
});
