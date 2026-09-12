const fs = require('fs');

let content = fs.readFileSync('src/components/modals/InvoiceModal.tsx', 'utf8');

const logicToLift = `const breakdown = getOrderBreakdown(viewingInvoice.items || [], viewingInvoice.pricingTier || viewingInvoice.category || viewingInvoice.clientType, viewingInvoice.paymentMethod, viewingInvoice.manualDiscount, viewingInvoice.clientType, viewingInvoice.accountId, viewingInvoice.migrationFlatDiscount || 0);
                   if (viewingInvoice.totalPrice !== undefined) breakdown.total = Number(viewingInvoice.totalPrice);
                   if (viewingInvoice.subtotal !== undefined) breakdown.subtotal = Number(viewingInvoice.subtotal);
                   if (viewingInvoice.totalDiscount !== undefined && viewingInvoice.totalDiscount > 0) {
                     breakdown.lines = [{ label: "Descuento Aplicado", amount: Number(viewingInvoice.totalDiscount) }];
                   } else if (viewingInvoice.totalPrice !== undefined && breakdown.subtotal > breakdown.total) {
                     breakdown.lines = [{ label: "Descuento / Ajuste", amount: breakdown.subtotal - breakdown.total }];
                   }`;

// Remove from IIFE
content = content.replace(logicToLift, '');

// Add to top of component
const injectionPoint = 'if (!viewingInvoice) return null;';
const liftedLogic = `  const breakdown = getOrderBreakdown(viewingInvoice.items || [], viewingInvoice.pricingTier || viewingInvoice.category || viewingInvoice.clientType, viewingInvoice.paymentMethod, viewingInvoice.manualDiscount, viewingInvoice.clientType, viewingInvoice.accountId, viewingInvoice.migrationFlatDiscount || 0);
  if (viewingInvoice.totalPrice !== undefined) breakdown.total = Number(viewingInvoice.totalPrice);
  if (viewingInvoice.subtotal !== undefined) breakdown.subtotal = Number(viewingInvoice.subtotal);
  if (viewingInvoice.totalDiscount !== undefined && viewingInvoice.totalDiscount > 0) {
    breakdown.lines = [{ label: "Descuento Aplicado", amount: Number(viewingInvoice.totalDiscount) }];
  } else if (viewingInvoice.totalPrice !== undefined && breakdown.subtotal > breakdown.total) {
    breakdown.lines = [{ label: "Descuento / Ajuste", amount: breakdown.subtotal - breakdown.total }];
  }`;

content = content.replace(injectionPoint, `${injectionPoint}\n\n${liftedLogic}\n`);

fs.writeFileSync('src/components/modals/InvoiceModal.tsx', content);

