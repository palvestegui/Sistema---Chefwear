const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function processImage() {
  try {
    const img = await loadImage('public/favicon.png');
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // If near white, make transparent
      if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
        data[i+3] = 0; // alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('public/favicon.png', buffer);
    console.log('Background made transparent successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

processImage();
