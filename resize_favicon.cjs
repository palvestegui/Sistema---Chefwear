const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function resize() {
  try {
    const image = await loadImage('assets/favicon.png');
    const canvas = createCanvas(64, 64);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, 64, 64);
    const buffer = canvas.toBuffer('image/png');
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    fs.writeFileSync('public/favicon.png', buffer);
    console.log('Resized successfully');
  } catch (e) {
    console.error('Error resizing, generating fallback instead:', e.message);
    const canvas = createCanvas(64, 64);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AZ', 32, 32);
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    fs.writeFileSync('public/favicon.png', canvas.toBuffer('image/png'));
  }
}
resize();
