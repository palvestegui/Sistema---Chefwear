const fs = require('fs');
let content = fs.readFileSync('src/hooks/useOrderCreator.ts', 'utf8');

content = content.replace(
  /userId: sellerInfo\.sellerUid/g,
  "userId: sellerInfo.sellerUid,\n          role: newOrder.contactRole || (newOrder.clientType === 'Universidad / Instituto' ? 'ESTUDIANTE' : (newOrder.clientType === 'Particular / Individuo' ? 'PARTICULAR' : 'OTRO'))"
);

fs.writeFileSync('src/hooks/useOrderCreator.ts', content);
