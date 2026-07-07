const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/app/[lang]/(main)');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file === 'page.tsx' || file === 'layout.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            // e.g. /home/faranaiki/Git/webaiki/src/app/[lang]/(main)/college/page.tsx -> "college"
            // e.g. /home/faranaiki/Git/webaiki/src/app/[lang]/(main)/news/[id]/page.tsx -> "news"
            let namespace = path.basename(path.dirname(fullPath));
            if (namespace.startsWith('[')) {
                namespace = path.basename(path.dirname(path.dirname(fullPath)));
            }
            if (namespace === '(main)') namespace = 'home';
            
            // Replaces getDictionary(lang) with getDictionary(lang, ['namespace', 'misc-1', 'misc-2', 'misc-3', 'home', 'identity', 'portfolio'])
            // Wait, we don't want to list too many. Let's just list 'home', 'misc-1', 'misc-2', 'misc-3', 'website', and the specific namespace.
            let namespaces = `['${namespace}', 'home', 'misc-1', 'misc-2', 'misc-3', 'website']`;
            
            // Clean duplicates
            let nsArray = Array.from(new Set(['home', 'misc-1', 'misc-2', 'misc-3', 'website', namespace]));
            namespaces = JSON.stringify(nsArray).replace(/"/g, "'");

            if (content.includes('getDictionary(lang)')) {
                content = content.replace(/getDictionary\(lang\)/g, `getDictionary(lang, ${namespaces})`);
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(srcDir);
