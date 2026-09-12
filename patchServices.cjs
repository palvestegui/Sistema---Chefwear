const fs = require('fs');
function patchFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(
    /<span className="text-\[10px\] font-bold uppercase tracking-widest" style=\{\{ color: '#78716c' \}\}>· \{lbl\}<\/span>/g,
    `<span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#78716c' }}>
      · {lbl} <span className="font-mono text-stone-400 font-bold" style={{ color: '#a8a29e' }}>Bs{customPrice.toFixed(2)}</span>
    </span>`
  );
  fs.writeFileSync(filename, content);
}
patchFile('src/components/ui/OrderReceiptDocument.tsx');
patchFile('src/components/modals/InvoiceModal.tsx');
