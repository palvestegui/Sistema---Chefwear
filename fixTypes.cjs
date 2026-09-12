const fs = require('fs');

function fix(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(
    /getOrderBreakdown: \(items: any\[\], category\??: string, paymentMethod\??: string, manualDiscount\??: number, clientType\??: string\) => any[;,]/g,
    "getOrderBreakdown: (items: any[], category?: string, paymentMethod?: string, manualDiscount?: number, clientType?: string, accountId?: string, migrationFlatDiscount?: number) => any,"
  );
  fs.writeFileSync(filename, content);
}

const files = [
  'src/components/views/sales/QuotesList.tsx',
  'src/components/views/sales/ActiveOrdersList.tsx',
  'src/components/views/SalesView.tsx',
  'src/hooks/useFinanceActions.ts'
];

files.forEach(f => {
  if (fs.existsSync(f)) fix(f);
});

console.log('Fixed types');
