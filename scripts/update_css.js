const fs = require('fs');
const file = 'src/app/globals-themes.css';
let content = fs.readFileSync(file, 'utf8');

// Rename .theme-mono to .theme-grey
content = content.replace(/\.theme-mono/g, '.theme-grey');
// But we want to add back .theme-mono. So we'll append it.

const newThemes = `
/* Monochrome (Pure Black & White) */
.theme-mono {
  --theme-bg: #ffffff;
  --theme-bg-dark: #000000;
  --theme-surface: #ffffff;
  --theme-surface-strong: #f4f4f5;
  --theme-border: #d4d4d8;
  --theme-muted: #52525b;
  --theme-shadow: rgba(0, 0, 0, 0.1);
  --theme-color-100: #f4f4f5;
  --theme-color-200: #e4e4e7;
  --theme-color-300: #d4d4d8;
  --theme-color-400: #a1a1aa;
  --theme-color-500: #71717a;
  --theme-color-600: #000000;
  --theme-color-700: #000000;
  --theme-color-800: #000000;
  --theme-color-900: #000000;
}

/* Red (Crimson) */
.theme-red {
  --theme-bg: #fef2f2;
  --theme-bg-dark: #450a0a;
  --theme-surface: #ffffff;
  --theme-surface-strong: #fef2f2;
  --theme-border: #fecaca;
  --theme-muted: #b91c1c;
  --theme-shadow: rgba(239, 68, 68, 0.1);
  --theme-color-100: #fee2e2;
  --theme-color-200: #fecaca;
  --theme-color-300: #fca5a5;
  --theme-color-400: #f87171;
  --theme-color-500: #ef4444;
  --theme-color-600: #dc2626;
  --theme-color-700: #b91c1c;
  --theme-color-800: #991b1b;
  --theme-color-900: #7f1d1d;
}

/* Teal (Ocean) */
.theme-teal {
  --theme-bg: #f0fdfa;
  --theme-bg-dark: #042f2e;
  --theme-surface: #ffffff;
  --theme-surface-strong: #f0fdfa;
  --theme-border: #99f6e4;
  --theme-muted: #0f766e;
  --theme-shadow: rgba(20, 184, 166, 0.1);
  --theme-color-100: #ccfbf1;
  --theme-color-200: #99f6e4;
  --theme-color-300: #5eead4;
  --theme-color-400: #2dd4bf;
  --theme-color-500: #14b8a6;
  --theme-color-600: #0d9488;
  --theme-color-700: #0f766e;
  --theme-color-800: #115e59;
  --theme-color-900: #134e4a;
}
`;

const newDarkThemes = `
.dark.theme-mono {
  --theme-surface: #000000;
  --theme-surface-strong: #09090b;
  --theme-border: #27272a;
  --theme-muted: #a1a1aa;
  --theme-shadow: rgba(255, 255, 255, 0.1);
  --accent-shadow: rgba(255, 255, 255, 0.2);
}

.dark.theme-red {
  --theme-surface: #1a0505;
  --theme-surface-strong: #2a0808;
  --theme-border: #450a0a;
  --theme-muted: #f87171;
  --theme-shadow: rgba(239, 68, 68, 0.2);
  --accent-shadow: rgba(239, 68, 68, 0.4);
}

.dark.theme-teal {
  --theme-surface: #021210;
  --theme-surface-strong: #04211d;
  --theme-border: #042f2e;
  --theme-muted: #2dd4bf;
  --theme-shadow: rgba(20, 184, 166, 0.2);
  --accent-shadow: rgba(20, 184, 166, 0.4);
}
`;

// Insert newThemes right before "/* Light mode Gacor and Accent mapping */"
content = content.replace('/* Light mode Gacor and Accent mapping */', newThemes + '\n/* Light mode Gacor and Accent mapping */');

// Add .theme-mono, .theme-red, .theme-teal to accent mapping
const accentMappingMono = `.theme-grey:not(.dark) { --accent-shadow: rgba(100, 116, 139, 0.3); }`;
content = content.replace(accentMappingMono, accentMappingMono + `
.theme-mono:not(.dark) { --accent-shadow: rgba(0, 0, 0, 0.3); }
.theme-red:not(.dark) { --accent-shadow: rgba(239, 68, 68, 0.3); }
.theme-teal:not(.dark) { --accent-shadow: rgba(20, 184, 166, 0.3); }
`);

// Insert newDarkThemes right before ".dark.theme-blue"
content = content.replace('.dark.theme-blue, :root:not', newDarkThemes + '\n.dark.theme-blue, :root:not');

// Also update the fallback selector
content = content.replace(':not(.theme-grey).dark {', ':not(.theme-grey):not(.theme-mono):not(.theme-red):not(.theme-teal).dark {');

fs.writeFileSync(file, content);
console.log('CSS updated');
