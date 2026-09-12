const fs = require('fs');

function patch(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(/order\.pricingTier \|\| order\.pricingTier \|\| order\.category/g, 'order.pricingTier || order.category');
  content = content.replace(/viewingInvoice\.pricingTier \|\| viewingInvoice\.pricingTier \|\| viewingInvoice\.category/g, 'viewingInvoice.pricingTier || viewingInvoice.category');
  content = content.replace(/x\.pricingTier \|\| x\.pricingTier \|\| x\.category/g, 'x.pricingTier || x.category');
  fs.writeFileSync(filename, content);
}

const files = [
  'src/components/views/sales/QuotesList.tsx',
  'src/components/modals/InvoiceModal.tsx',
  'src/components/modals/CollectPaymentModal.tsx',
  'src/components/modals/PaymentModal.tsx',
  'src/components/ui/OrderReceiptDocument.tsx',
  'src/utils/csvFormatters.ts',
  'src/hooks/useExportEngine.ts'
];

files.forEach(f => {
  if (fs.existsSync(f)) patch(f);
});

console.log('Duplicates fixed');
