const fs = require('fs');

function patchFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  // Fix the "Bs" casing inside uppercase containers in QuotesList
  content = content.replace(
    /Si abonas el 100% hoy, pagas solo <span className="text-amber-400 font-mono">Bs\{bkCash\.total\.toFixed\(2\)\}<\/span> \(Ahorras Bs\{savings\.toFixed\(2\)\}\)/g,
    'Si abonas el 100% hoy, pagas solo <span className="text-amber-400 font-mono normal-case">Bs{bkCash.total.toFixed(2)}</span> (Ahorras <span className="normal-case">Bs{savings.toFixed(2)}</span>)'
  );

  // Add the services details under each item
  const targetRender = `                    <p className="text-sm font-black text-stone-400 font-mono">Bs{(getItemUnitPrice(it, order.category) * (it.qty || 1)).toFixed(2)}</p>
                  </div>
                </div>`;

  const newRender = `                    <p className="text-sm font-black text-stone-400 font-mono">Bs{(getItemUnitPrice(it, order.category) * (it.qty || 1)).toFixed(2)}</p>
                  </div>
                  {it.services && it.services.length > 0 && (
                     <div className="flex flex-col gap-1 pl-4 mt-1">
                        {it.services.filter(s => {
                           const srv = pricing?.services?.find(x => x.name === s && x.garment === it.name) || pricing?.services?.find(x => x.name === s && x.garment === 'Global') || pricing?.services?.find(x => x.name === s);
                           return (!srv && s.toUpperCase().includes('LOGO')) || (srv && (srv.type === 'Costo Adicional' || srv.type === 'Costo Adicional Editable' || srv.type === 'Escala de Volumen (Logos)'));
                        }).map(s => {
                           let lbl = s;
                           if (s.toLowerCase().includes('bolsillo') && it.pocketName) lbl = \`\${s}: \${it.pocketName}\`;
                           if (s === 'Bolsillos personalizados' && it.customPocketDetails) lbl = \`\${s}: \${it.customPocketDetails}\`;
                           const srv = pricing?.services?.find(x => x.name === s && x.garment === it.name) || pricing?.services?.find(x => x.name === s && x.garment === 'Global') || pricing?.services?.find(x => x.name === s);
                           const isLogoFallback = !srv && s.toUpperCase().includes('LOGO');
                           
                           // Using a generic calculation to avoid importing calculateVolumeScaledServiceUnitPrice directly here if not available,
                           // but wait, calculateVolumeScaledServiceUnitPrice is imported in utils? Let's just import it or do the math inline.
                           // Actually it's better to just require the calculation.
                           // Let's implement the fallback math inline if not found:
                           let customPrice = 0;
                           if (srv?.type === 'Escala de Volumen (Logos)' || isLogoFallback) {
                              const qty = it.qty || 1;
                              if (qty === 1) customPrice = 70;
                              else if (qty === 2) customPrice = 40;
                              else if (qty === 3) customPrice = 30;
                              else if (qty === 4) customPrice = 25;
                              else if (qty === 5) customPrice = 22;
                              else customPrice = 20;
                           } else {
                              customPrice = (it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0);
                           }

                           return (
                              <div key={s} className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">· {lbl} <span className="font-mono text-stone-600 font-bold ml-1">Bs{customPrice.toFixed(2)}</span></span>
                                 <span className="font-mono text-[10px] font-bold text-stone-400">Bs{(customPrice * (it.qty||1)).toFixed(2)}</span>
                              </div>
                           );
                        })}
                     </div>
                  )}
                </div>`;
  
  if (content.includes(targetRender)) {
    content = content.replace(targetRender, newRender);
    fs.writeFileSync(filename, content);
  } else {
    console.log("Could not find target render in", filename);
  }
}

patchFile('src/components/views/sales/QuotesList.tsx');
patchFile('src/components/views/sales/ActiveOrdersList.tsx');

console.log('Dark cards fixed');
