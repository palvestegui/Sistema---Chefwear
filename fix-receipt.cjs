const fs = require('fs');

let content = fs.readFileSync('src/components/ui/OrderReceiptDocument.tsx', 'utf8');

const logicToLift = `const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount, order.clientType, order.accountId, order.migrationFlatDiscount || 0);
  if (order.totalPrice !== undefined) breakdown.total = Number(order.totalPrice);
  if (order.subtotal !== undefined) breakdown.subtotal = Number(order.subtotal);
  if (order.totalDiscount !== undefined && order.totalDiscount > 0) {
    breakdown.lines = [{ label: "Descuento Aplicado", amount: Number(order.totalDiscount) }];
  } else if (order.totalPrice !== undefined && breakdown.subtotal > breakdown.total) {
    breakdown.lines = [{ label: "Descuento / Ajuste", amount: breakdown.subtotal - breakdown.total }];
  }`;

// Remove from IIFE
content = content.replace(logicToLift, '');

// Add to top of component
const injectionPoint = 'if (!order) return null;';
const liftedLogic = `  const breakdown = getOrderBreakdown(order.items || [], order.pricingTier || order.category || order.clientType, order.paymentMethod, order.manualDiscount, order.clientType, order.accountId, order.migrationFlatDiscount || 0);
  if (order.totalPrice !== undefined) breakdown.total = Number(order.totalPrice);
  if (order.subtotal !== undefined) breakdown.subtotal = Number(order.subtotal);
  if (order.totalDiscount !== undefined && order.totalDiscount > 0) {
    breakdown.lines = [{ label: "Descuento Aplicado", amount: Number(order.totalDiscount) }];
  } else if (order.totalPrice !== undefined && breakdown.subtotal > breakdown.total) {
    breakdown.lines = [{ label: "Descuento / Ajuste", amount: breakdown.subtotal - breakdown.total }];
  }`;

content = content.replace(injectionPoint, `${injectionPoint}\n\n${liftedLogic}\n`);

fs.writeFileSync('src/components/ui/OrderReceiptDocument.tsx', content);

