const fs = require('fs');

let content = fs.readFileSync('src/components/views/sales/QuotesList.tsx', 'utf8');

// Replace Number(order.totalPrice || breakdown.total)
content = content.replace(
  /Number\(order\.totalPrice \|\| breakdown\.total\)/g,
  "breakdown.total"
);

fs.writeFileSync('src/components/views/sales/QuotesList.tsx', content);

console.log('Fixed QuotesList Math');
