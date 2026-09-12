const fs = require('fs');
let content = fs.readFileSync('src/utils/pricingCalculator.ts', 'utf8');

// The original getPrice is still down there. We need to remove it.
content = content.replace("  const getPrice = calculateItemPriceRawFn || (() => 0);", "");

// And we need to add it BEFORE the migration block.
const insertPoint = `  const collapsedItems = collapseUdiItems(itemsList || []);`;
const newInsert = `  const collapsedItems = collapseUdiItems(itemsList || []);
  const getPrice = calculateItemPriceRawFn || (() => 0);`;

content = content.replace(insertPoint, newInsert);

fs.writeFileSync('src/utils/pricingCalculator.ts', content);
