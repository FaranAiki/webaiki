const fs = require('fs');
const path = require('path');
const https = require('https');

async function translate(text, targetLang) {
  // Try translating 3 times before falling back to original
  for(let i=0; i<3; i++) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
          res.on('error', reject);
        }).on('error', reject);
      });
      const json = JSON.parse(res);
      let result = '';
      if(json && json[0]) {
        json[0].forEach(part => result += part[0]);
        return result;
      }
    } catch(e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return text;
}

async function main() {
  const localesDir = path.join(process.cwd(), 'public/locales');
  const enDir = path.join(localesDir, 'en');
  const idDir = path.join(localesDir, 'id');
  
  const langs = fs.readdirSync(localesDir).filter(d => fs.statSync(path.join(localesDir, d)).isDirectory() && d !== 'en' && d !== 'id');
  
  const filesToCheck = ['project.json', 'organization.json'];
  
  for (const lang of langs) {
    console.log(`Processing ${lang}...`);
    for (const file of filesToCheck) {
      const enPath = path.join(enDir, file);
      const idPath = path.join(idDir, file);
      const targetPath = path.join(localesDir, lang, file);
      
      if (!fs.existsSync(targetPath)) continue;
      
      const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      const idData = JSON.parse(fs.readFileSync(idPath, 'utf8'));
      const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      
      let updated = false;
      
      for (const key of Object.keys(enData)) {
        if (targetData[key]) {
          const enVal = enData[key];
          const idVal = idData[key];
          const targetVal = targetData[key];
          
          if (typeof enVal === 'string') {
            // Re-translate if it equals english or indonesian
            // Also re-translate if we updated the source string and we want it to propagate (though if it equals english, it will be caught)
            // Wait, if it WAS translated previously but we updated the english one, it won't equal the english one! 
            // So for the specific keys we just updated, we should FORCE translate.
            const forceKeys = []; 
            if (forceKeys.includes(key) || targetVal === enVal || targetVal === idVal) {
              const translated = await translate(enVal, lang);
              if (translated !== targetVal) {
                targetData[key] = translated;
                updated = true;
                console.log(`[${lang}] Updated ${key}: ${translated.substring(0, 30)}...`);
              }
            }
          } else if (Array.isArray(enVal)) {
            for (let i = 0; i < enVal.length; i++) {
              // Force keys for array elements
              const forceKeyIndex = (key === 'ALTH_Project_Description' && i === 0) || (key === 'IT_Club_Vice_Renpy_Description' && i === 2);
              
              if (forceKeyIndex || targetVal[i] === enVal[i] || targetVal[i] === idVal[i]) {
                const translated = await translate(enVal[i], lang);
                if (translated !== targetVal[i]) {
                  targetData[key][i] = translated;
                  updated = true;
                  console.log(`[${lang}] Updated ${key}[${i}]: ${translated.substring(0, 30)}...`);
                }
              }
            }
          }
        }
      }
      
      if (updated) {
        fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2) + '\n', 'utf8');
      }
    }
  }
}

main().catch(console.error);
