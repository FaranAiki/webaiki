const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('page.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src/app');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // First, remove ANY previously inserted nonce declarations just in case
    content = content.replace(/const nonce = \(await headers\(\)\)\.get\("x-nonce"\) \|\| "";\n\s*/g, '');
    
    // Find "export default async function"
    const regex = /export\s+default\s+async\s+function\s+\w+\s*\([^)]*\)\s*\{/;
    const match = content.match(regex);
    if (match) {
        const insertPos = match.index + match[0].length;
        content = content.slice(0, insertPos) + '\n  const nonce = (await headers()).get("x-nonce") || "";' + content.slice(insertPos);
    }
    
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
});
