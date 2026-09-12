const fs = require('fs');

function replaceInFile(filePath, search, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(search, replacement);
  fs.writeFileSync(filePath, content);
}

// AccountHistoryModal.tsx
let content = fs.readFileSync('src/components/modals/AccountHistoryModal.tsx', 'utf8');
content = content.replace(/Number\(order\.totalPrice \|\| 0\)/g, 
  '(order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0))'
);
fs.writeFileSync('src/components/modals/AccountHistoryModal.tsx', content);

// ReceiptsModal.tsx
let rContent = fs.readFileSync('src/components/modals/ReceiptsModal.tsx', 'utf8');
rContent = rContent.replace(/const total = Number\(order\.totalPrice \|\| 0\);/g, 
  `const total = order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0);`
);
fs.writeFileSync('src/components/modals/ReceiptsModal.tsx', rContent);

// QuotesHistoryList.tsx
let qContent = fs.readFileSync('src/components/views/sales/QuotesHistoryList.tsx', 'utf8');
qContent = qContent.replace(/const totalPrice = Number\(order\.totalPrice \|\| 0\);/g, 
  `const totalPrice = order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0);`
);
fs.writeFileSync('src/components/views/sales/QuotesHistoryList.tsx', qContent);

// OrderReceiptDocument.tsx
// wait, line 231: const currentTotal = Number(order.totalPrice || breakdownCash.subtotal);
let ordContent = fs.readFileSync('src/components/ui/OrderReceiptDocument.tsx', 'utf8');
ordContent = ordContent.replace(/const currentTotal = Number\(order\.totalPrice \|\| breakdownCash\.subtotal\);/g, 
  `const currentTotal = order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || breakdownCash.subtotal) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || breakdownCash.subtotal);`
);
fs.writeFileSync('src/components/ui/OrderReceiptDocument.tsx', ordContent);

