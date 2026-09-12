const fs = require('fs');

function patch(filename, regex, replacement) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(regex, replacement);
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
  if (fs.existsSync(f)) {
     patch(f, /order\.category \|\| order\.clientType/g, 'order.pricingTier || order.category || order.clientType');
     patch(f, /viewingInvoice\.category\b/g, 'viewingInvoice.pricingTier || viewingInvoice.category');
     patch(f, /x\.category\b/g, 'x.pricingTier || x.category');
     patch(f, /order\.category\b/g, 'order.pricingTier || order.category');
  }
});

console.log('Fixed');
