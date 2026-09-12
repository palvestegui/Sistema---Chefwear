const fs = require('fs');

let content = fs.readFileSync('src/components/modals/InvoiceModal.tsx', 'utf8');

content = content.replace(/const currentTotal = Number\(viewingInvoice\.totalPrice \|\| breakdownCash\.subtotal\);/g, 
  `const currentTotal = viewingInvoice.migrationFlatDiscount > 0 && viewingInvoice.subtotal !== undefined && Number(viewingInvoice.totalPrice) === Number(viewingInvoice.subtotal) ? Math.max(0, Number(viewingInvoice.totalPrice || breakdownCash.subtotal) - Number(viewingInvoice.migrationFlatDiscount)) : Number(viewingInvoice.totalPrice || breakdownCash.subtotal);`
);

fs.writeFileSync('src/components/modals/InvoiceModal.tsx', content);

