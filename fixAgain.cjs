const fs = require('fs');
function patchFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  
  // Clean up any weird newlines we accidentally introduced
  content = content.replace(/<span className="text-\[10px\] font-bold uppercase tracking-widest" style=\{\{ color: '#78716c' \}\}>\s*· \{lbl\}\s*<\/span>/g,
    `<span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#78716c' }}>· {lbl}</span>`
  );
  
  // Now replace the specific line
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const customPrice =')) {
      // Find the next span that has · {lbl}
      for (let j = i + 1; j < i + 6; j++) {
        if (lines[j] && lines[j].includes('· {lbl}')) {
          lines[j] = lines[j].replace('· {lbl}', '· {lbl} <span className="font-mono text-stone-400 font-bold ml-1" style={{ color: \'#a8a29e\' }}>Bs{customPrice.toFixed(2)}</span>');
          break;
        }
      }
    }
  }
  
  fs.writeFileSync(filename, lines.join('\n'));
}
patchFile('src/components/ui/OrderReceiptDocument.tsx');
patchFile('src/components/modals/InvoiceModal.tsx');
