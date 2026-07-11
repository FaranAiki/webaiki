const fs = require('fs');
const file = 'src/app/globals-themes.css';
let content = fs.readFileSync(file, 'utf8');

const goldTheme = `
/* Gold (Amber) */
.theme-gold {
  --theme-bg: #fffbeb;
  --theme-bg-dark: #451a03;
  --theme-surface: #ffffff;
  --theme-surface-strong: #fffbeb;
  --theme-border: #fde68a;
  --theme-muted: #b45309;
  --theme-shadow: rgba(217, 119, 6, 0.1);
  --theme-color-100: #fef3c7;
  --theme-color-200: #fde68a;
  --theme-color-300: #fcd34d;
  --theme-color-400: #fbbf24;
  --theme-color-500: #f59e0b;
  --theme-color-600: #d97706;
  --theme-color-700: #b45309;
  --theme-color-800: #92400e;
  --theme-color-900: #78350f;
}
`;

const darkGoldTheme = `
.dark.theme-gold {
  --theme-surface: #1f0d01;
  --theme-surface-strong: #2e1402;
  --theme-border: #451a03;
  --theme-muted: #fbbf24;
  --theme-shadow: rgba(217, 119, 6, 0.2);
  --accent-shadow: rgba(217, 119, 6, 0.4);
}
`;

content = content.replace('/* Light mode Gacor and Accent mapping */', goldTheme + '\n/* Light mode Gacor and Accent mapping */');
content = content.replace('.theme-teal:not(.dark) { --accent-shadow: rgba(20, 184, 166, 0.3); }', '.theme-teal:not(.dark) { --accent-shadow: rgba(20, 184, 166, 0.3); }\n.theme-gold:not(.dark) { --accent-shadow: rgba(217, 119, 6, 0.3); }');
content = content.replace('.dark.theme-blue, :root:not', darkGoldTheme + '\n.dark.theme-blue, :root:not');
content = content.replace(':not(.theme-teal).dark {', ':not(.theme-teal):not(.theme-gold).dark {');

fs.writeFileSync(file, content);
console.log('CSS updated with gold theme');
