const fs = require('fs');
let content = fs.readFileSync('src/utils/csvFormatters.ts', 'utf8');

const target = "getItemUnitPrice: (item: any, category: string) => number";
const replacement = "getItemUnitPrice: (item: any, category: string, accountId?: string) => number";

content = content.replace(target, replacement);
fs.writeFileSync('src/utils/csvFormatters.ts', content);
