const fs = require('fs');
let content = fs.readFileSync('src/components/views/sales/QuotesList.tsx', 'utf8');

content = content.replace(
  /getItemUnitPrice\(it, order\.category\)/g,
  "getItemUnitPrice(it, order.pricingTier || order.category || order.clientType)"
);

fs.writeFileSync('src/components/views/sales/QuotesList.tsx', content);

