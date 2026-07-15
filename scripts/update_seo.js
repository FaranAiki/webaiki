const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'portfolio/page.tsx', dictKey: 'Portfolio', name: 'Portfolio' },
  { path: 'news/page.tsx', dictKey: 'News', name: 'News' },
  { path: 'project/page.tsx', dictKey: 'Project', name: 'Project' },
  { path: 'timeline/page.tsx', dictKey: 'Timeline', name: 'Timeline' },
  { path: 'work/page.tsx', dictKey: 'Work', name: 'Work' },
  { path: 'college/page.tsx', dictKey: 'College', name: 'College' },
  { path: 'award/page.tsx', dictKey: 'Award', name: 'Award' },
  { path: 'certificate/page.tsx', dictKey: 'Certificate', name: 'Certificate' },
  { path: 'organization/page.tsx', dictKey: 'Organization', name: 'Organization' },
  { path: 'latest/page.tsx', dictKey: 'Latest_Activity', name: 'Latest Activity' },
  { path: 'all/page.tsx', dictKey: 'All', name: 'All' },
];

const basePath = path.join(__dirname, '../src/app/[lang]/(main)');

for (const page of pages) {
  const fullPath = path.join(basePath, page.path);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Add getBreadcrumbSchema to import if not present
  if (!content.includes('getBreadcrumbSchema')) {
    content = content.replace(/import \{([^}]+)\} from '@\/lib\/seo';/, (match, p1) => {
      if (p1.includes('getBreadcrumbSchema')) return match;
      return `import {${p1}, getBreadcrumbSchema } from '@/lib/seo';`;
    });
  }

  // Update openGraph images
  const ogRegex = /openGraph:\s*\{([^}]*url:\s*`\$\{SITE_URL\}\/\$\{lang\}\/[^`]+`,?)/s;
  if (ogRegex.test(content) && !content.includes('images: [')) {
    content = content.replace(ogRegex, (match, p1) => {
      const ogTitleString = `\${dict.${page.dictKey} || '${page.name}'}`;
      return `openGraph: {${p1}\n      images: [\n        {\n          url: \`\$\{SITE_URL\}/api/og?title=\$\{encodeURIComponent(${ogTitleString})\}\`,\n          width: 1200,\n          height: 630,\n        }\n      ],`;
    });
  }

  // Update jsonLd @graph to include BreadcrumbList
  const jsonLdRegex = /("@context":\s*"https:\/\/schema\.org",\s*"@graph":\s*\[)([^\]]+)(\])/;
  if (jsonLdRegex.test(content) && !content.includes('getBreadcrumbSchema(')) {
    content = content.replace(jsonLdRegex, (match, p1, p2, p3) => {
      const pagePath = page.path.split('/')[0];
      const breadcrumbCode = `\n      getBreadcrumbSchema([\n        { name: 'Home', item: \`/\${lang}\` },\n        { name: dict.${page.dictKey} || '${page.name}', item: \`/\${lang}/${pagePath}\` }\n      ])`;
      
      // Check if p2 ends with comma
      let cleanP2 = p2.trim();
      if (!cleanP2.endsWith(',')) {
        cleanP2 += ',';
      }
      return `${p1}\n      ${cleanP2}${breadcrumbCode}\n    ${p3}`;
    });
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${page.path}`);
}
