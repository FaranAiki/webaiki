const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public', 'locales');
const files = fs.readdirSync(localesDir);

const translations = {
  en: "Loading...",
  id: "Memuat...",
  zh: "加载中...",
  jp: "読み込み中...",
  ru: "Загрузка...",
  fr: "Chargement...",
  ar: "جاري التحميل...",
  es: "Cargando...",
  ko: "로딩 중...",
  de: "Wird geladen...",
  nl: "Laden...",
  ha: "Ana lodawa...",
  he: "טוען...",
  el: "Φόρτωση...",
  hi: "लोड हो रहा है...",
  pt: "Carregando...",
  bn: "লোড হচ্ছে...",
  vi: "Đang tải..."
};

files.forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add or update Loading key
    data['Loading'] = translations[lang] || "Loading...";
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
