const fs = require('fs');
let code = fs.readFileSync('src/components/views/sales/QuotesHistoryList.tsx', 'utf8');

// The small icon-only button
code = code.replace(
  /<button\s+type="button"\s+onClick=\{\(\) => setViewingReceiptId\(order.id\)\}\s+className="bg-stone-900 hover:bg-stone-800 text-stone-300 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-1 border border-stone-800"\s+title="Ver Comprobantes y Movimientos de Pago"\s*>\s*<Receipt size=\{15\}\/>\s*<\/button>/g,
  `{order.paymentHistory && order.paymentHistory.some((p: any) => p.receipt) && (
                      <button 
                        type="button"
                        onClick={() => setViewingReceiptId(order.id)}
                        className="bg-stone-900 hover:bg-stone-800 text-amber-500 px-3.5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-1 border border-stone-800"
                        title="Ver Recibos"
                      >
                        <Eye size={15}/> ({order.paymentHistory.filter((p: any) => p.receipt).length})
                      </button>
                    )}`
);

// The full text button
code = code.replace(
  /<button\s+type="button"\s+onClick=\{\(\) => setViewingReceiptId\(order.id\)\}\s+className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-300 py-3 rounded-xl text-\[11px\] font-black uppercase tracking-widest transition flex items-center justify-center gap-1\.5 border border-stone-800"\s*>\s*<Receipt size=\{14\}\/> Comprobantes\s*<\/button>/g,
  `{order.paymentHistory && order.paymentHistory.some((p: any) => p.receipt) && (
                      <button 
                        type="button"
                        onClick={() => setViewingReceiptId(order.id)}
                        className="flex-1 bg-stone-900 hover:bg-stone-800 text-amber-500 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition flex items-center justify-center gap-1.5 border border-stone-800"
                      >
                        <Eye size={14}/> Ver Recibos ({order.paymentHistory.filter((p: any) => p.receipt).length})
                      </button>
                    )}`
);

// also the condition around it might be {setViewingReceiptId && ( <button ... /> )}, which would now be {setViewingReceiptId && ( {order.paymentHistory...} )} which is a syntax error if not wrapped.
fs.writeFileSync('src/components/views/sales/QuotesHistoryList.tsx', code);
