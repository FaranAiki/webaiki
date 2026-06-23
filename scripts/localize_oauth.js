/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const dictionariesDir = path.join(__dirname, 'public', 'locales');

const translations = {
  en: "Or Continue With",
  id: "Atau Lanjutkan Dengan",
  zh: "或继续使用",
  jp: "または次で続行",
  ru: "Или продолжить с",
  fr: "Ou Continuer Avec",
  ar: "أو الاستمرار مع",
  es: "O Continuar Con",
  ko: "또는 다음으로 계속",
  de: "Oder Weiter Mit",
  nl: "Of Ga Door Met",
  ha: "Ko Ci Gaba Da",
  he: "או המשך עם",
  el: "Ή Συνεχίστε Με",
  hi: "या इसके साथ जारी रखें",
  pt: "Ou Continue Com",
  bn: "অথবা চালিয়ে যান",
  vi: "Hoặc Tiếp Tục Với"
};

fs.readdirSync(dictionariesDir).forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const filePath = path.join(dictionariesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (translations[lang]) {
      content.Or_Continue_With = translations[lang];
    } else {
      content.Or_Continue_With = "Or Continue With";
    }

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done!');
