const fs = require('fs');
function patchFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(
    /const customPrice = \(\(it\.customServicePrices && it\.customServicePrices\[s\] !== undefined\) \? Number\(it\.customServicePrices\[s\]\) : \(srv\?\.price \|\| 0\)\);/g,
    `const customPrice = (it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0);`
  );
  
  // Find the exact line in the second map
  // We can do it by replacing the whole return block inside the second map
  const target = `const customPrice = (it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0);
                           return (
                              <div key={s} className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#78716c' }}>
      · {lbl} 
    </span>
                                 <span className="font-mono text-[10px] font-bold" style={{ color: '#1c1917' }}>Bs{(customPrice * (it.qty||1)).toFixed(2)}</span>
                              </div>
                           );`;
                           
  const target2 = `const customPrice = (it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0);
                             return (
                                <div key={s} className="flex justify-between items-center">
                                   <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#78716c' }}>
      · {lbl} 
    </span>
                                   <span className="font-mono text-[10px] font-bold" style={{ color: '#1c1917' }}>Bs{(customPrice * (it.qty||1)).toFixed(2)}</span>
                                </div>
                             );`;
                             
  const replace = `const customPrice = (it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0);
                           return (
                              <div key={s} className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#78716c' }}>
                                    · {lbl} <span className="font-mono text-stone-400 font-bold ml-1" style={{ color: '#a8a29e' }}>Bs{customPrice.toFixed(2)}</span>
                                 </span>
                                 <span className="font-mono text-[10px] font-bold" style={{ color: '#1c1917' }}>Bs{(customPrice * (it.qty||1)).toFixed(2)}</span>
                              </div>
                           );`;
                           
  const replace2 = `const customPrice = (it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0);
                             return (
                                <div key={s} className="flex justify-between items-center">
                                   <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#78716c' }}>
                                      · {lbl} <span className="font-mono text-stone-400 font-bold ml-1" style={{ color: '#a8a29e' }}>Bs{customPrice.toFixed(2)}</span>
                                   </span>
                                   <span className="font-mono text-[10px] font-bold" style={{ color: '#1c1917' }}>Bs{(customPrice * (it.qty||1)).toFixed(2)}</span>
                                </div>
                             );`;

  content = content.replace(target, replace);
  content = content.replace(target2, replace2);
  fs.writeFileSync(filename, content);
}
patchFile('src/components/ui/OrderReceiptDocument.tsx');
patchFile('src/components/modals/InvoiceModal.tsx');
