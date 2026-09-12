const fs = require('fs');
let content = fs.readFileSync('src/utils/pricingCalculator.ts', 'utf8');

// The original getPrice is still down there.
content = content.replace("const getPrice = calculateItemPriceRawFn || (() => 0);", "");

fs.writeFileSync('src/utils/pricingCalculator.ts', content);
