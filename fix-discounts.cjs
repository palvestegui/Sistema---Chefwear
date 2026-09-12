const fs = require('fs');

const replaceInFile = (filePath, searchPattern, replacement) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(new RegExp(searchPattern, 'g'), replacement);
    fs.writeFileSync(filePath, content);
  }
};

replaceInFile('src/components/modals/newOrder/OrderSummaryAndCheckout.tsx', 'newOrder\\.pricingTier \\|\\| newOrder\\.category,', 'newOrder.pricingTier || newOrder.category || newOrder.clientType,');
replaceInFile('src/components/modals/InvoiceModal.tsx', 'viewingInvoice\\.pricingTier \\|\\| viewingInvoice\\.category,', 'viewingInvoice.pricingTier || viewingInvoice.category || viewingInvoice.clientType,');
replaceInFile('src/components/ui/OrderReceiptDocument.tsx', 'order\\.pricingTier \\|\\| order\\.category,', 'order.pricingTier || order.category || order.clientType,');
replaceInFile('src/utils/csvFormatters.ts', 'x\\.pricingTier \\|\\| x\\.category,', 'x.pricingTier || x.category || x.clientType,');
replaceInFile('src/hooks/useOrderCreator.ts', 'newOrder\\.pricingTier \\|\\| newOrder\\.category,', 'newOrder.pricingTier || newOrder.category || newOrder.clientType,');
replaceInFile('src/hooks/useExportEngine.ts', 'x\\.pricingTier \\|\\| x\\.category,', 'x.pricingTier || x.category || x.clientType,');
