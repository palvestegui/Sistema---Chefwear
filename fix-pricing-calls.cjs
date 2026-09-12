const fs = require('fs');

const filesToFix = [
  'src/components/modals/newOrder/OrderSummaryAndCheckout.tsx',
  'src/components/modals/InvoiceModal.tsx',
  'src/components/modals/CancellationVoucherModal.tsx',
  'src/components/views/sales/QuotesHistoryList.tsx',
  'src/components/views/sales/QuotesList.tsx',
  'src/components/views/sales/ActiveOrdersList.tsx',
  'src/components/views/reports/ReportePrendasTable.tsx',
  'src/components/ui/OrderReceiptDocument.tsx',
  'src/utils/csvFormatters.ts',
  'src/hooks/useExportEngine.ts',
  'src/hooks/usePricingEngine.ts'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Pattern 1: getItemUnitPrice(it, something)
    content = content.replace(/getItemUnitPrice\(it,\s*it\.pricingTier \|\| newOrder\.pricingTier \|\| newOrder\.category\)/g, "getItemUnitPrice(it, it.pricingTier || newOrder.pricingTier || newOrder.category, newOrder.accountId)");
    content = content.replace(/getItemUnitPrice\(it,\s*viewingInvoice\.pricingTier \|\| viewingInvoice\.category\)/g, "getItemUnitPrice(it, viewingInvoice.pricingTier || viewingInvoice.category, viewingInvoice.accountId)");
    content = content.replace(/getItemUnitPrice\(it,\s*cancelledOrder\.category\)/g, "getItemUnitPrice(it, cancelledOrder.category, cancelledOrder.accountId)");
    content = content.replace(/getItemUnitPrice\(it,\s*order\.category\)/g, "getItemUnitPrice(it, order.category, order.accountId)");
    content = content.replace(/getItemUnitPrice\(it,\s*order\.pricingTier \|\| order\.category\)/g, "getItemUnitPrice(it, order.pricingTier || order.category, order.accountId)");
    content = content.replace(/getItemUnitPrice\(it,\s*order\.pricingTier \|\| order\.category \|\| order\.clientType\)/g, "getItemUnitPrice(it, order.pricingTier || order.category || order.clientType, order.accountId)");
    content = content.replace(/getItemUnitPrice\(it,\s*x\.category\)/g, "getItemUnitPrice(it, x.category, x.accountId)");
    content = content.replace(/getItemUnitPrice\(it,\s*x\.pricingTier \|\| x\.category\)/g, "getItemUnitPrice(it, x.pricingTier || x.category, x.accountId)");
    content = content.replace(/getItemUnitPrice\(item,\s*item\.pricingTier \|\| category\)/g, "getItemUnitPrice(item, item.pricingTier || category, accountId || item?.accountId)");
    
    fs.writeFileSync(file, content);
  }
});
