const fs = require('fs');
let content = fs.readFileSync('src/utils/pricingCalculator.ts', 'utf8');

content = content.replace(
  "calculateItemPriceRawFn?: (item: any, cat: string) => number,",
  "calculateItemPriceRawFn?: (item: any, cat: string, accId?: string) => number,"
);

content = content.replace(
  "const itemRawCost = calculateItemPriceRawFn ? calculateItemPriceRawFn(it, category) : 0;",
  "const itemRawCost = calculateItemPriceRawFn ? calculateItemPriceRawFn(it, category, accountId) : 0;"
);

content = content.replace(
  "const rawCost = calculateItemPriceRawFn ? calculateItemPriceRawFn(it, category) : 0;",
  "const rawCost = calculateItemPriceRawFn ? calculateItemPriceRawFn(it, category, accountId) : 0;"
);

fs.writeFileSync('src/utils/pricingCalculator.ts', content);
