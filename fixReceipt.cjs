const fs = require('fs');

function patchFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  // Fix grey text contrast (a8a29e -> 57534e)
  content = content.replace(/color: '#a8a29e'/g, "color: '#57534e'");
  // Fix 78716c -> 44403c
  content = content.replace(/color: '#78716c'/g, "color: '#44403c'");

  // Fix the AHORRA BS issue
  content = content.replace(
    /<p className="text-\[10px\] font-black text-amber-800 uppercase tracking-widest leading-normal">\s*¡Paga al contado y ahorra Bs\{savings.toFixed\(2\)\}!\s*<\/p>\s*<p className="text-\[10px\] font-bold text-amber-700 mt-1 uppercase tracking-widest">\s*Total con dcto: Bs\{cashTotal.toFixed\(2\)\}\s*<\/p>/g,
    `<p className="text-sm font-black text-amber-800 tracking-widest leading-normal uppercase">
      ¡PAGA AL CONTADO Y AHORRA <span className="normal-case font-mono font-bold">Bs</span><span className="font-mono">{savings.toFixed(2)}</span>!
    </p>
    <p className="text-xs font-bold text-amber-700 mt-1 tracking-widest uppercase">
      TOTAL CON DCTO: <span className="normal-case font-mono font-bold">Bs</span><span className="font-mono">{cashTotal.toFixed(2)}</span>
    </p>`
  );

  fs.writeFileSync(filename, content);
}

patchFile('src/components/ui/OrderReceiptDocument.tsx');
patchFile('src/components/modals/InvoiceModal.tsx');

console.log('Receipts fixed');
