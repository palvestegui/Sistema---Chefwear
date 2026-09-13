const fs = require('fs');
let content = fs.readFileSync('src/server/pulseService.ts', 'utf8');
content = content.replace(/\\\`/g, '`');
fs.writeFileSync('src/server/pulseService.ts', content, 'utf8');
