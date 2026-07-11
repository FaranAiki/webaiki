const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const idContent = {
  "Color_Grey": "Abu-abu",
  "Color_Red": "Merah",
  "Color_Teal": "Teal"
};

const enContent = {
  "Color_Grey": "Grey",
  "Color_Red": "Red",
  "Color_Teal": "Teal"
};

for (const loc of locales) {
  // We look into misc-2.json (or misc-1.json if misc-2 is missing/doesn't have it)
  for (const file of ['misc-1.json', 'misc-2.json']) {
    const fPath = path.join(localesDir, loc, file);
    if (fs.existsSync(fPath)) {
      const contentStr = fs.readFileSync(fPath, 'utf8');
      if (contentStr.includes('"Color_Mono"')) {
        const data = JSON.parse(contentStr);
        const toMerge = loc === 'id' ? idContent : enContent;
        data['Color_Grey'] = toMerge['Color_Grey'];
        data['Color_Red'] = toMerge['Color_Red'];
        data['Color_Teal'] = toMerge['Color_Teal'];
        fs.writeFileSync(fPath, JSON.stringify(data, null, 2) + '\n');
        console.log(`Updated ${loc}/${file}`);
      }
    }
  }
}
