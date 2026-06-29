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
    
    // Check if file was broken
    if (!content.includes('const nonce = (await headers()).get("x-nonce") || "";')) return;
    
    // Remove the bad insertion
    content = content.replace(/\s*const nonce = \(await headers\(\)\)\.get\("x-nonce"\) \|\| ""; /, '');
    content = content.replace(/\n\s*const nonce = \(await headers\(\)\)\.get\("x-nonce"\) \|\| "";\n/, '\n');

    // Find the proper place to insert it.
    // It should go right after the opening brace of the function body.
    // The function signature ends with ") {"
    // Let's use a regex to find ") {" or "} ) {"
    // Better: look for the first line of the function body. 
    // Usually it's "const { lang } = await params;" or "const dict ="
    
    if (content.includes('const { lang } = await params;')) {
        content = content.replace('const { lang } = await params;', 'const nonce = (await headers()).get("x-nonce") || "";\n  const { lang } = await params;');
    } else if (content.includes('const { lang, id } = await params;')) {
        content = content.replace('const { lang, id } = await params;', 'const nonce = (await headers()).get("x-nonce") || "";\n  const { lang, id } = await params;');
    } else {
        // Fallback: replace "} ) {" or "}) {"
        content = content.replace(/\)\s*{\n/, ') {\n  const nonce = (await headers()).get("x-nonce") || "";\n');
    }
    
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
});
