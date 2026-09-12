const fs = require('fs');
let content = fs.readFileSync('src/hooks/useOrderCreator.ts', 'utf8');

content = content.replace(
  /newOrder\.accountId\n\s*\);/g,
  'newOrder.accountId,\n        newOrder.migrationFlatDiscount || 0\n      );'
);

fs.writeFileSync('src/hooks/useOrderCreator.ts', content);
