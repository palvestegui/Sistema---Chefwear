const fs = require('fs');

function replaceInFile(filePath, search, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(search, replacement);
  fs.writeFileSync(filePath, content);
}

// 1. OrderReceiptDocument.tsx
let receiptContent = fs.readFileSync('src/components/ui/OrderReceiptDocument.tsx', 'utf8');
const receiptLogic = `  const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount, order.clientType, order.accountId, order.migrationFlatDiscount || 0);
  if (order.totalPrice !== undefined) breakdown.total = Number(order.totalPrice);
  if (order.subtotal !== undefined) breakdown.subtotal = Number(order.subtotal);
  if (order.totalDiscount !== undefined && order.totalDiscount > 0) {
    breakdown.lines = [{ label: "Descuento Aplicado", amount: Number(order.totalDiscount) }];
  } else if (order.totalPrice !== undefined && breakdown.subtotal > breakdown.total) {
    breakdown.lines = [{ label: "Descuento / Ajuste", amount: breakdown.subtotal - breakdown.total }];
  }`;
const receiptGood = `  const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount, order.clientType, order.accountId, order.migrationFlatDiscount || 0);`;
receiptContent = receiptContent.replace(receiptLogic, receiptGood);
fs.writeFileSync('src/components/ui/OrderReceiptDocument.tsx', receiptContent);

// 2. InvoiceModal.tsx
let invoiceContent = fs.readFileSync('src/components/modals/InvoiceModal.tsx', 'utf8');
const invoiceLogic = `  const breakdown = getOrderBreakdown(viewingInvoice.items || [], viewingInvoice.pricingTier || viewingInvoice.category || viewingInvoice.clientType, viewingInvoice.paymentMethod, viewingInvoice.manualDiscount, viewingInvoice.clientType, viewingInvoice.accountId, viewingInvoice.migrationFlatDiscount || 0);
  if (viewingInvoice.totalPrice !== undefined) breakdown.total = Number(viewingInvoice.totalPrice);
  if (viewingInvoice.subtotal !== undefined) breakdown.subtotal = Number(viewingInvoice.subtotal);
  if (viewingInvoice.totalDiscount !== undefined && viewingInvoice.totalDiscount > 0) {
    breakdown.lines = [{ label: "Descuento Aplicado", amount: Number(viewingInvoice.totalDiscount) }];
  } else if (viewingInvoice.totalPrice !== undefined && breakdown.subtotal > breakdown.total) {
    breakdown.lines = [{ label: "Descuento / Ajuste", amount: breakdown.subtotal - breakdown.total }];
  }`;
const invoiceGood = `  const breakdown = getOrderBreakdown(viewingInvoice.items || [], viewingInvoice.pricingTier || viewingInvoice.category || viewingInvoice.clientType, viewingInvoice.paymentMethod, viewingInvoice.manualDiscount, viewingInvoice.clientType, viewingInvoice.accountId, viewingInvoice.migrationFlatDiscount || 0);`;
invoiceContent = invoiceContent.replace(invoiceLogic, invoiceGood);
fs.writeFileSync('src/components/modals/InvoiceModal.tsx', invoiceContent);

// 3. ActiveOrdersList.tsx
replaceInFile(
  'src/components/views/sales/ActiveOrdersList.tsx',
  'const total = order.totalPrice !== undefined ? Number(order.totalPrice) : getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0).total;',
  'const total = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0).total;'
);

// 4. QuotesList.tsx
replaceInFile(
  'src/components/views/sales/QuotesList.tsx',
  'const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod || \'50/50 - Adelantado/Entrega\', order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0);\n        if (order.totalPrice !== undefined) breakdown.total = Number(order.totalPrice);',
  'const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod || \'50/50 - Adelantado/Entrega\', order.manualDiscount || 0, order.clientType, order.accountId, order.migrationFlatDiscount || 0);'
);

