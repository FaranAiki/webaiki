import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const localesDir = path.join(process.cwd(), 'public/locales');
const files = ['ar.json', 'de.json', 'el.json', 'en.json', 'es.json', 'fr.json', 'ha.json', 'he.json', 'id.json', 'jp.json', 'ko.json', 'nl.json', 'ru.json', 'zh.json'];

const updates = {
  'id.json': { "Portfolio_Filter": "Filter Portofolio", "Filter_Top": "Teratas", "Top": "Teratas" },
  'en.json': { "Portfolio_Filter": "Portfolio Filter", "Filter_Top": "Top", "Top": "Top" },
  'ar.json': { "Portfolio_Filter": "مرشح المحفظة", "Filter_Top": "الأعلى", "Top": "الأعلى" },
  'de.json': { "Portfolio_Filter": "Portfolio-Filter", "Filter_Top": "Top", "Top": "Top" },
  'el.json': { "Portfolio_Filter": "Φίλτρο Χαρτοφυλακίου", "Filter_Top": "Κορυφαία", "Top": "Κορυφαία" },
  'es.json': { "Portfolio_Filter": "Filtro de Portafolio", "Filter_Top": "Superior", "Top": "Superior" },
  'fr.json': { "Portfolio_Filter": "Filtre de Portfolio", "Filter_Top": "Top", "Top": "Top" },
  'ha.json': { "Portfolio_Filter": "Matatar Portfolio", "Filter_Top": "Saman", "Top": "Saman" },
  'he.json': { "Portfolio_Filter": "מסנן תיק עבודות", "Filter_Top": "עליון", "Top": "עליון" },
  'jp.json': { "Portfolio_Filter": "ポートフォリオフィルター", "Filter_Top": "トップ", "Top": "トップ" },
  'ko.json': { "Portfolio_Filter": "포트폴리오 필터", "Filter_Top": "상위", "Top": "상위" },
  'nl.json': { "Portfolio_Filter": "Portfoliofilter", "Filter_Top": "Top", "Top": "Top" },
  'ru.json': { "Portfolio_Filter": "Фильтр Портфолио", "Filter_Top": "Топ", "Top": "Топ" },
  'zh.json': { "Portfolio_Filter": "作品集筛选", "Filter_Top": "顶部", "Top": "顶部" }
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const fileUpdates = updates[file];
    if (fileUpdates) {
      Object.keys(fileUpdates).forEach(key => {
        content[key] = fileUpdates[key];
      });
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
      console.log(`Updated ${file}`);
    }
  } else {
    console.error(`File not found: ${file}`);
  }
});
