const fs = require('fs');
function fixFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(
    /· \{lbl\} <span className="font-mono text-stone-400 font-bold" style=\{\{ color: '#a8a29e' \}\}>Bs\{customPrice\.toFixed\(2\)\}<\/span>/g,
    '· {lbl}'
  );
  content = content.replace(
    /<span className="font-mono text-\[10px\] font-bold" style=\{\{ color: '#1c1917' \}\}>Bs\{\(customPrice \* \(it\.qty\|\|1\)\)\.toFixed\(2\)\}<\/span>/g,
    `<span className="font-mono text-[10px] font-bold" style={{ color: '#1c1917' }}>Bs{(customPrice * (it.qty||1)).toFixed(2)}</span>`
  );
  fs.writeFileSync(filename, content);
}
fixFile('src/components/ui/OrderReceiptDocument.tsx');
fixFile('src/components/modals/InvoiceModal.tsx');
