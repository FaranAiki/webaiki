const sharp = require('sharp');
const fs = require('fs');

const dir = './public/images/icons';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Create a simple blue icon with an 'F' in the middle
const svgImage = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0ea5e9"/>
  <text x="50%" y="50%" font-family="Arial" font-size="256" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">F</text>
</svg>
`;

sharp(Buffer.from(svgImage))
  .resize(192, 192)
  .png()
  .toFile(dir + '/icon-192x192.png')
  .then(() => console.log('192x192 done'));

sharp(Buffer.from(svgImage))
  .resize(512, 512)
  .png()
  .toFile(dir + '/icon-512x512.png')
  .then(() => console.log('512x512 done'));
