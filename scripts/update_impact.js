const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const idContent = {
  "Impact_Module_Author": "Penulis Modul Matematika SSU/IUP ITB untuk IMPACT 6.0",
  "Impact_Module_Author_Description": [
    "Menulis tiga modul matematika persiapan SSU/IUP ITB untuk 50+ siswa.",
    "Merancang set soal dan solusi try out SSU/IUP ITB.",
    "Berkolaborasi dengan rekan akademis untuk memastikan standar konten berkualitas tinggi."
  ]
};

const enContent = {
  "Impact_Module_Author": "ITB SSU/IUP Mathematics Module Author for IMPACT 6.0",
  "Impact_Module_Author_Description": [
    "Authored three mathematics modules for ITB SSU/IUP preparation for 50+ students.",
    "Designed problem sets and solutions for ITB SSU/IUP try outs.",
    "Collaborated with academic peers to ensure high-quality content standards."
  ]
};

for (const loc of locales) {
  const workFile = path.join(localesDir, loc, 'work.json');
  if (fs.existsSync(workFile)) {
    const data = JSON.parse(fs.readFileSync(workFile, 'utf8'));
    
    const contentToUse = loc === 'id' ? idContent : enContent;

    data['Impact_Module_Author'] = contentToUse['Impact_Module_Author'];
    data['Impact_Module_Author_Description'] = contentToUse['Impact_Module_Author_Description'];

    fs.writeFileSync(workFile, JSON.stringify(data, null, 2) + '\n');
    console.log(`Updated ${loc}/work.json`);
  }
}
