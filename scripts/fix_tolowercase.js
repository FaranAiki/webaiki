const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            content = content.replace(/([a-zA-Z0-9_]+)\.title\.toLowerCase\(\)/g, '(($1.title || "").toLowerCase())');
            content = content.replace(/([a-zA-Z0-9_]+)\.company\.toLowerCase\(\)/g, '(($1.company || "").toLowerCase())');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed', fullPath);
            }
        }
    }
}

processDirectory(path.join(__dirname, '../src'));
