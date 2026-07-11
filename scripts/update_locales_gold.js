const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const idContent = {
  "Color_Gold": "Emas"
};

const enContent = {
  "Color_Gold": "Gold"
};

for (const loc of locales) {
  for (const file of ['misc-1.json', 'misc-2.json']) {
    const fPath = path.join(localesDir, loc, file);
    if (fs.existsSync(fPath)) {
      const contentStr = fs.readFileSync(fPath, 'utf8');
      if (contentStr.includes('"Color_Mono"')) {
        const data = JSON.parse(contentStr);
        const toMerge = loc === 'id' ? idContent : enContent;
        data['Color_Gold'] = toMerge['Color_Gold'];
        fs.writeFileSync(fPath, JSON.stringify(data, null, 2) + '\n');
        console.log(`Updated ${loc}/${file}`);
      }
    }
  }
}
