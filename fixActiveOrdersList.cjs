const fs = require('fs');

let content = fs.readFileSync('src/components/views/sales/ActiveOrdersList.tsx', 'utf8');

// Replace `const total = Number(order.totalPrice || 0);`
// with `const total = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0).total;`
content = content.replace(
  /const total = Number\(order\.totalPrice \|\| 0\);/g,
  "const total = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0).total;"
);

fs.writeFileSync('src/components/views/sales/ActiveOrdersList.tsx', content);

console.log('Fixed ActiveOrdersList Math');
