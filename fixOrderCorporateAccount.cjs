const fs = require('fs');
let content = fs.readFileSync('src/hooks/useOrderCreator.ts', 'utf8');

content = content.replace(
  /deliveryAddress: newOrder\.address,\n\s*userId: sellerInfo\.sellerUid,\n\s*role: newOrder\.contactRole[^\n]+\n\s*}, \[\]/g,
  "deliveryAddress: newOrder.address,\n            userId: sellerInfo.sellerUid\n          }, []"
);

fs.writeFileSync('src/hooks/useOrderCreator.ts', content);
