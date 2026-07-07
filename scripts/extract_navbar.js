const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'public/locales');
const locales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const navKeys = [
  'Home', 'Identity', 'Website', 'Feedback', 'Profile', 'Portfolio', 'All', 'Social', 'Certificate',
  'News', 'Experience', 'Work', 'Project', 'Organization', 'Award', 'Hire_Me', 'Artwork', 'Music',
  'Literature', 'Nav_Other', 'College', 'Academic_Transcript', 'Timeline', 'Sitemap_Graph'
];

locales.forEach(locale => {
  const localeDir = path.join(localesDir, locale);
  const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'));
  
  const navbarDict = {};
  
  files.forEach(file => {
    const filePath = path.join(localeDir, file);
    if (file === 'navbar.json') return; // skip if already exists
    
    let content;
    try {
      content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return;
    }
    
    let modified = false;
    navKeys.forEach(key => {
      if (content[key] !== undefined) {
        navbarDict[key] = content[key];
        delete content[key];
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    }
  });
  
  fs.writeFileSync(path.join(localeDir, 'navbar.json'), JSON.stringify(navbarDict, null, 2) + '\n');
});

console.log('Successfully separated navbar keys into navbar.json for all locales!');
