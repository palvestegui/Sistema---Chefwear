const fs = require('fs');
let content = fs.readFileSync('src/hooks/usePricingEngine.ts', 'utf8');

content = content.replace(
  /const getItemUnitPrice = \(item: any, category: string = 'Personal', accountId\?: string\) => \{\n    if \(\!pricing\) return 0;/g,
  `const getItemUnitPrice = (item: any, category: string = 'Personal', accountId?: string) => {
    if (item?.customUnitPrice !== undefined && item?.customUnitPrice !== null) {
      return Number(item.customUnitPrice);
    }
    if (!pricing) return 0;`
);

fs.writeFileSync('src/hooks/usePricingEngine.ts', content);
