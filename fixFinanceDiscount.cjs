const fs = require('fs');
let content = fs.readFileSync('src/hooks/useFinanceActions.ts', 'utf8');

content = content.replace(
  /clientTypeToUse\n\s*\);/g,
  'clientTypeToUse,\n        currentOrder.accountId || order.accountId,\n        currentOrder.migrationFlatDiscount || order.migrationFlatDiscount || 0\n      );'
);

fs.writeFileSync('src/hooks/useFinanceActions.ts', content);
