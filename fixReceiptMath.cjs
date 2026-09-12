const fs = require('fs');

function replaceTotalPrice(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  // Replace order.totalPrice in Total General
  content = content.replace(
    /Number\(order\.totalPrice \|\| 0\)/g,
    "getOrderBreakdown(order.items || [], order.pricingTier || order.category, order.paymentMethod, order.manualDiscount, order.clientType, order.accountId, order.migrationFlatDiscount || 0).total"
  );
  
  // Also fix in InvoiceModal
  content = content.replace(
    /Number\(viewingInvoice\.totalPrice \|\| 0\)/g,
    "getOrderBreakdown(viewingInvoice.items || [], viewingInvoice.pricingTier || viewingInvoice.category, viewingInvoice.paymentMethod, viewingInvoice.manualDiscount, viewingInvoice.clientType, viewingInvoice.accountId, viewingInvoice.migrationFlatDiscount || 0).total"
  );

  fs.writeFileSync(filename, content);
}

replaceTotalPrice('src/components/ui/OrderReceiptDocument.tsx');
replaceTotalPrice('src/components/modals/InvoiceModal.tsx');
console.log('Fixed math rendering');
