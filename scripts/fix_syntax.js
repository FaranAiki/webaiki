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
            let changed = false;
            
            // Revert .title?.toLowerCase() ?? "" back to (job.title || '').toLowerCase()
            // Wait, the original was just .title.toLowerCase()
            if (content.includes('?.toLowerCase() ?? ""')) {
                content = content.replace(/\.title\?\.toLowerCase\(\) \?\? ""/g, '?.title?.toLowerCase() || ""');
                content = content.replace(/\.company\?\.toLowerCase\(\) \?\? ""/g, '?.company?.toLowerCase() || ""');
                fs.writeFileSync(fullPath, content);
                changed = true;
                console.log('Fixed', fullPath);
            }
        }
    }
}

processDirectory(path.join(__dirname, '../src'));
