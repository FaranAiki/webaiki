const fs = require('fs');
const glob = require('glob'); // Not available by default in node script, we'll just use a recursive function
const path = require('path');

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
    
    // Check if file contains <script
    if (!content.includes('<script')) return;
    
    // Skip if already has nonce={nonce}
    if (content.includes('nonce={nonce}')) return;
    
    console.log(`Fixing ${file}`);
    
    // Add import if needed
    if (!content.includes('next/headers')) {
        // find first import
        content = content.replace(/(import .*?;?\n)/, '$1import { headers } from "next/headers";\n');
    }
    
    // Add nonce variable extraction
    // Find the export default async function
    const funcMatch = content.match(/export default async function[^{]*{/);
    if (funcMatch) {
        const insertPos = funcMatch.index + funcMatch[0].length;
        content = content.slice(0, insertPos) + '\n  const nonce = (await headers()).get("x-nonce") || "";' + content.slice(insertPos);
    }
    
    // Replace <script with <script nonce={nonce}
    content = content.replace(/<script\s/g, '<script nonce={nonce} ');
    
    fs.writeFileSync(file, content);
});

console.log("Done");
