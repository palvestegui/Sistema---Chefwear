const fs = require('fs');
let content = fs.readFileSync('src/hooks/useFinanceActions.ts', 'utf8');

content = content.replace(
  /const categoryToUse = currentOrder\.category \|\| currentOrder\.clientType \|\| order\.category \|\| order\.clientType;/g,
  'const categoryToUse = currentOrder.pricingTier || currentOrder.category || currentOrder.clientType || order.pricingTier || order.category || order.clientType;'
);

fs.writeFileSync('src/hooks/useFinanceActions.ts', content);
