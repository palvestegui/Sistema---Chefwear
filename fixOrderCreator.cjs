const fs = require('fs');
let content = fs.readFileSync('src/hooks/useOrderCreator.ts', 'utf8');

content = content.replace(
  /const breakdown = getOrderBreakdown\(\s*newOrder\.items,\s*newOrder\.category,/g,
  'const breakdown = getOrderBreakdown(\n        newOrder.items,\n        newOrder.pricingTier || newOrder.category,'
);

fs.writeFileSync('src/hooks/useOrderCreator.ts', content);
