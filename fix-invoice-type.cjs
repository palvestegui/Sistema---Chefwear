const fs = require('fs');

const filesToFix = [
  'src/components/modals/InvoiceModal.tsx',
  'src/components/modals/CancellationVoucherModal.tsx',
  'src/components/ui/OrderReceiptDocument.tsx'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace("getItemUnitPrice: (it: any, category: string) => number;", "getItemUnitPrice: (it: any, category: string, accountId?: string) => number;");
    content = content.replace("getItemUnitPrice: (it: any, category?: string) => number;", "getItemUnitPrice: (it: any, category?: string, accountId?: string) => number;");
    fs.writeFileSync(file, content);
  }
});
