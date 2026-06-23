/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public/locales');
const idPath = path.join(localesDir, 'id.json');
const idContent = JSON.parse(fs.readFileSync(idPath, 'utf8'));

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && f !== 'id.json');

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let updated = false;
  Object.keys(idContent).forEach(key => {
    if (content[key] === undefined) {
      content[key] = idContent[key];
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    console.log(`Synced ${file}`);
  }
});
