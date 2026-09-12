const fs = require('fs');
let content = fs.readFileSync('src/components/modals/InvoiceModal.tsx', 'utf8');

content = content.replace(
  /<span className="font-black uppercase tracking-tight" style=\{\{ color: '#1c1917' \}\}>\{it\.name\}<\/span>/,
  `<span className="font-black uppercase tracking-tight" style={{ color: '#1c1917' }}>{it.name} <span className="font-mono text-stone-400 font-bold" style={{ color: '#a8a29e' }}>Bs{getItemUnitPrice(it, viewingInvoice.category).toFixed(2)}</span></span>`
);

fs.writeFileSync('src/components/modals/InvoiceModal.tsx', content);
