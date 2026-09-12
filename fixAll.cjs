const fs = require('fs');

function patchFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  
  // Fix the "0" issue in OrderReceiptDocument
  content = content.replace(
    /\{\(\!isQuote \|\| \(order\.amountCollected && order\.amountCollected > 0\)\) && \(/g,
    '{(!isQuote || (order.amountCollected || 0) > 0) && ('
  );

  // Apply `normal-case` wrapping to "Bs" across common patterns
  const patterns = [
    />Bs\{getItemUnitPrice/g,
    />Bs\{customPrice/g,
    />Bs\{\(customPrice \*/g,
    />Bs\{\(getItemUnitPrice/g,
    />Bs\{Number/g,
    />Bs\{getOrderBreakdown/g,
    />Bs\{Math.max/g,
  ];

  patterns.forEach(p => {
    content = content.replace(p, (match) => {
      const rest = match.slice(3); // remove '>Bs'
      return '><span className="normal-case">Bs</span>' + rest;
    });
  });
  
  content = content.replace(/>-Bs\{line\.amount/g, '>-<span className="normal-case">Bs</span>{line.amount');

  // Fix Paga al contado box in OrderReceiptDocument
  if (filename.includes('OrderReceiptDocument')) {
    content = content.replace(
      /className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center mt-3"/g,
      'className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 text-center mt-6 shadow-sm"'
    );
    content = content.replace(
      /className="text-sm font-black text-amber-800 tracking-widest leading-normal uppercase"/g,
      'className="text-lg font-black text-amber-900 tracking-widest leading-normal uppercase"'
    );
    content = content.replace(
      /className="text-xs font-bold text-amber-700 mt-1 tracking-widest uppercase"/g,
      'className="text-sm font-bold text-amber-800 mt-2 tracking-widest uppercase"'
    );
  }

  fs.writeFileSync(filename, content);
}

patchFile('src/components/ui/OrderReceiptDocument.tsx');
patchFile('src/components/modals/InvoiceModal.tsx');

console.log('Fixed casings, 0, and box size.');
