const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public/locales');

// The targeted replacements
const updates = {
  'misc-1.json': {
    Make_Website_Description: {
      index: 0,
      id: "Merekayasa situs web portofolio dengan pengunjung sekitar 2.000+ pengunjung dan 10.000+ views",
      en: "Engineered a portfolio website with around 2,000+ visitors and 10,000+ views"
    }
  },
  'organization.json': {
    Treasurer_SYNC_Description: {
      index: 1,
      id: "Meningkatkan anggaran uang acara sekitar 5,45% dengan mendapatkan 1 juta hasil sponsorship dengan Analitica",
      en: "Increased the event's financial budget by around 5.45% by securing 1 million sponsorship deals with Analitica"
    },
    Impact_Web_Lead_Description: {
      index: 0,
      id: "Merancang dan mengelola situs olimpiade IMPACT 6.0 yang digunakan oleh 400+ tim dan 1100+ siswa SMA di tingkat nasional",
      en: "Designed and managed the IMPACT 6.0 olympiad website used by 400+ teams and 1100+ high school students nationwide"
    }
  },
  'award.json': {
    Paragon_Scholarship_Desc: {
      index: 1,
      id: "Berpartisipasi dalam 10+ pelatihan kepemimpinan dan program pengembangan masyarakat.",
      en: "Participated in 10+ leadership training and community development programs."
    },
    ONMIPA_Award_Desc: {
      index: 0,
      id: "Meraih Medali Perak, 0.1% dari 5000-an mahasiswa matematika terbaik di universitasnya, dalam kompetisi Matematika bergengsi ONMIPA-PT 2026.",
      en: "Secured the Silver Medal, top 0.1% of around 5000 top mathematics students in the university, in the prestigious Mathematics competition ONMIPA-PT 2026."
    }
  }
};

const dirs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

dirs.forEach(lang => {
  Object.keys(updates).forEach(filename => {
    const jsonPath = path.join(localesDir, lang, filename);
    if (fs.existsSync(jsonPath)) {
      const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      let modified = false;
      const fileUpdates = updates[filename];
      
      Object.keys(fileUpdates).forEach(key => {
        if (content[key] && Array.isArray(content[key])) {
          const updateInfo = fileUpdates[key];
          const newText = (lang === 'id') ? updateInfo.id : updateInfo.en;
          
          if (content[key][updateInfo.index] !== undefined) {
             content[key][updateInfo.index] = newText;
             modified = true;
          }
        }
      });
      
      if (modified) {
        fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2) + '\n', 'utf8');
      }
    }
  });
});

console.log('Done fixing locales');
