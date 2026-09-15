const fs = require('fs');
let code = fs.readFileSync('src/domains/udi/udiBundleEngine.ts', 'utf8');
code = code.replace("for (const category of appliedCategories) {", "for (const category of Array.from(appliedCategories)) {");
fs.writeFileSync('src/domains/udi/udiBundleEngine.ts', code);
