const fs = require('fs');

function replaceInFile(filePath, searchPattern, replacement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(searchPattern, replacement);
    fs.writeFileSync(filePath, content);
  }
}

// ActiveOrdersList.tsx
replaceInFile(
  'src/components/views/sales/ActiveOrdersList.tsx',
  'const total = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0).total;',
  'const total = order.totalPrice !== undefined ? Number(order.totalPrice) : getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0).total;'
);

// QuotesList.tsx
replaceInFile(
  'src/components/views/sales/QuotesList.tsx',
  'const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod || \'50/50 - Adelantado/Entrega\', order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0);',
  'const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod || \'50/50 - Adelantado/Entrega\', order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0);\n        if (order.totalPrice !== undefined) breakdown.total = Number(order.totalPrice);'
);

// OrderReceiptDocument.tsx
// Instead of modifying every getOrderBreakdown call, let's just declare a variable at the top of the component and use it.
replaceInFile(
  'src/components/ui/OrderReceiptDocument.tsx',
  'const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount, order.clientType, order.accountId, order.migrationFlatDiscount || 0);',
  'const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount, order.clientType, order.accountId, order.migrationFlatDiscount || 0);\n  if (order.totalPrice !== undefined) breakdown.total = Number(order.totalPrice);\n  if (order.subtotal !== undefined) breakdown.subtotal = Number(order.subtotal);\n  if (order.totalDiscount !== undefined && order.totalDiscount > 0) {\n    breakdown.lines = [{ label: "Descuento Aplicado", amount: Number(order.totalDiscount) }];\n  } else if (order.totalPrice !== undefined && breakdown.subtotal > breakdown.total) {\n    breakdown.lines = [{ label: "Descuento / Ajuste", amount: breakdown.subtotal - breakdown.total }];\n  }'
);

// Now replace the inline calls in OrderReceiptDocument.tsx
let receiptContent = fs.readFileSync('src/components/ui/OrderReceiptDocument.tsx', 'utf8');
receiptContent = receiptContent.replace(/getOrderBreakdown\([^)]+\)\.subtotal/g, 'breakdown.subtotal');
receiptContent = receiptContent.replace(/getOrderBreakdown\([^)]+\)\.lines/g, 'breakdown.lines');
receiptContent = receiptContent.replace(/getOrderBreakdown\([^)]+\)\.total/g, 'breakdown.total');
fs.writeFileSync('src/components/ui/OrderReceiptDocument.tsx', receiptContent);

// InvoiceModal.tsx
replaceInFile(
  'src/components/modals/InvoiceModal.tsx',
  'const breakdown = getOrderBreakdown(viewingInvoice.items || [], viewingInvoice.pricingTier || viewingInvoice.category || viewingInvoice.clientType, viewingInvoice.paymentMethod, viewingInvoice.manualDiscount, viewingInvoice.clientType, viewingInvoice.accountId, viewingInvoice.migrationFlatDiscount || 0);',
  'const breakdown = getOrderBreakdown(viewingInvoice.items || [], viewingInvoice.pricingTier || viewingInvoice.category || viewingInvoice.clientType, viewingInvoice.paymentMethod, viewingInvoice.manualDiscount, viewingInvoice.clientType, viewingInvoice.accountId, viewingInvoice.migrationFlatDiscount || 0);\n                   if (viewingInvoice.totalPrice !== undefined) breakdown.total = Number(viewingInvoice.totalPrice);\n                   if (viewingInvoice.subtotal !== undefined) breakdown.subtotal = Number(viewingInvoice.subtotal);\n                   if (viewingInvoice.totalDiscount !== undefined && viewingInvoice.totalDiscount > 0) {\n                     breakdown.lines = [{ label: "Descuento Aplicado", amount: Number(viewingInvoice.totalDiscount) }];\n                   } else if (viewingInvoice.totalPrice !== undefined && breakdown.subtotal > breakdown.total) {\n                     breakdown.lines = [{ label: "Descuento / Ajuste", amount: breakdown.subtotal - breakdown.total }];\n                   }'
);

let invoiceContent = fs.readFileSync('src/components/modals/InvoiceModal.tsx', 'utf8');
invoiceContent = invoiceContent.replace(/getOrderBreakdown\([^)]+\)\.subtotal/g, 'breakdown.subtotal');
invoiceContent = invoiceContent.replace(/getOrderBreakdown\([^)]+\)\.lines/g, 'breakdown.lines');
invoiceContent = invoiceContent.replace(/getOrderBreakdown\([^)]+\)\.total/g, 'breakdown.total');
fs.writeFileSync('src/components/modals/InvoiceModal.tsx', invoiceContent);

