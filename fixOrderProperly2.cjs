const fs = require('fs');
let content = fs.readFileSync('src/hooks/useOrderCreator.ts', 'utf8');

content = content.replace(
  /role: normalizeRole\(newOrder\.contactRole, newOrder\.clientType\)\)/g,
  "role: normalizeRole(newOrder.contactRole, newOrder.clientType)"
);

fs.writeFileSync('src/hooks/useOrderCreator.ts', content);
