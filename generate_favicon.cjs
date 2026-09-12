const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const canvas = createCanvas(64, 64);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#f59e0b'; // Amber 500
ctx.beginPath();
ctx.arc(32, 32, 30, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#ffffff';
ctx.font = 'bold 30px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('AZ', 32, 32);

const outDir = path.join(__dirname, 'public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const out = fs.createWriteStream(path.join(outDir, 'favicon.png'));
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('The favicon.png was created.'));
