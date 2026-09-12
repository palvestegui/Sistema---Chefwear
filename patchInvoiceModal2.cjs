const fs = require('fs');
let content = fs.readFileSync('src/components/modals/InvoiceModal.tsx', 'utf8');

content = content.replace(
  "const isInstitutional = Boolean(",
  `const isQuote = getDocType(viewingInvoice) === 'COTIZACION';
  const displayId = isQuote && !viewingInvoice.id.toLowerCase().startsWith('cot') ? viewingInvoice.id.replace(/^ord-/i, 'cot-') : viewingInvoice.id;
  const isInstitutional = Boolean(`
);

content = content.replace(
  /<p className="text-xs font-mono font-bold text-amber-400 tracking-wider">#\{viewingInvoice\.id\}<\/p>/,
  `<p className="text-xs font-mono font-bold text-amber-400 tracking-wider">#{displayId}</p>`
);

content = content.replace(
  /<p className="text-sm font-mono font-bold mt-1">#\{viewingInvoice\.id\}<\/p>/,
  `<p className="text-sm font-mono font-bold mt-1">#{displayId}</p>`
);

fs.writeFileSync('src/components/modals/InvoiceModal.tsx', content);
