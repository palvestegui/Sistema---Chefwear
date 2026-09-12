const fs = require('fs');
let code = fs.readFileSync('src/components/views/HistoryView.tsx', 'utf8');

code = code.replace(
  "setViewingHistoryOrderId: (id: string | null) => void;",
  "setViewingHistoryOrderId: (id: string | null) => void;\n  setViewingReceiptId?: (id: string | null) => void;"
);

code = code.replace(
  "setViewingHistoryOrderId,",
  "setViewingHistoryOrderId,\n  setViewingReceiptId,"
);

const buttonStr = `                    <button onClick={() => setViewingInvoiceId(order.id)} className="text-[10px] bg-stone-100 text-stone-900 px-3 py-1 rounded font-black uppercase tracking-widest hover:bg-white transition flex items-center gap-1">
                      <FileText size={12}/> Invoice
                    </button>
                    {setViewingReceiptId && order.paymentHistory && order.paymentHistory.some((p: any) => p.receipt) && (
                      <button onClick={() => setViewingReceiptId(order.id)} className="text-[10px] bg-stone-800 border border-stone-700 text-amber-500 px-3 py-1 rounded font-black uppercase tracking-widest hover:bg-stone-700 transition flex items-center gap-1">
                        <Eye size={12}/> Recibos ({order.paymentHistory.filter((p: any) => p.receipt).length})
                      </button>
                    )}`;

code = code.replace(
  /<button onClick=\{\(\) => setViewingInvoiceId\(order.id\)\} className="text-\[10px\] bg-stone-100 text-stone-900 px-3 py-1 rounded font-black uppercase tracking-widest hover:bg-white transition flex items-center gap-1">\s*<FileText size=\{12\}\/> Invoice\s*<\/button>/,
  buttonStr
);

fs.writeFileSync('src/components/views/HistoryView.tsx', code);
