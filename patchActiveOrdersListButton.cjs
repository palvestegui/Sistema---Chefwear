const fs = require('fs');
let code = fs.readFileSync('src/components/views/sales/ActiveOrdersList.tsx', 'utf8');

const buttonStr = `                <button onClick={() => setViewingInvoiceId(order.id)} className="w-full bg-stone-100 hover:bg-white text-stone-900 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2">
                  <FileText size={16}/> Ver Invoice / Resumen
                </button>
                
                {setViewingReceiptId && order.paymentHistory && order.paymentHistory.some((p: any) => p.receipt) && (
                  <button onClick={() => setViewingReceiptId(order.id)} className="w-full bg-stone-850 hover:bg-stone-800 text-amber-500 border border-stone-800 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 mt-2">
                    <Eye size={16}/> Ver Recibos ({order.paymentHistory.filter((p: any) => p.receipt).length})
                  </button>
                )}`;

code = code.replace(
  /<button onClick=\{\(\) => setViewingInvoiceId\(order.id\)\} className="w-full bg-stone-100 hover:bg-white text-stone-900 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2">\s*<FileText size=\{16\}\/> Ver Invoice \/ Resumen\s*<\/button>/g,
  buttonStr
);

fs.writeFileSync('src/components/views/sales/ActiveOrdersList.tsx', code);
