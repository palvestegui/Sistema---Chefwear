const fs = require('fs');
let code = fs.readFileSync('src/components/views/ProductionView.tsx', 'utf8');

code = code.replace('<div className="grid grid-cols-1 gap-8">', '<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">');
code = code.replace(/<div key=\{order\.id\} className="bg-stone-900 border border-stone-800 p-6 md:p-8 rounded-\[2rem\] shadow-sm flex flex-col gap-6 relative">/, '<div key={order.id} className="bg-stone-900 border border-stone-800 p-3.5 sm:p-4 rounded-2xl shadow-sm flex flex-col justify-between gap-3 relative w-full overflow-hidden">');
code = code.replace('<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">', '<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">');

const headerStart = code.indexOf('<div className="flex justify-between items-center flex-wrap gap-4 select-none">');
const headerEnd = code.indexOf('{/* Grouped Production Garments Summary */}');

if (headerStart !== -1 && headerEnd !== -1) {
    const headerSection = code.substring(headerStart, headerEnd);
    const newHeader = `<div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2.5 sm:gap-2 select-none w-full">
                <div className="flex flex-wrap items-center gap-2 min-w-0 w-full sm:w-auto">
                  <h3 className="text-lg sm:text-xl font-black text-stone-200 uppercase tracking-tight truncate max-w-full sm:max-w-[180px] xl:max-w-[150px] 2xl:max-w-[200px]">{order.customer}</h3>
                  {isInstitutional && (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <Building2 size={10} /> Inst. ({order.items?.length || 0})
                    </span>
                  )}
                  <div className="shrink-0 scale-90 origin-left">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0 shrink-0">
                  {isInstitutional && (
                    <button 
                      onClick={() => setExpandedRosterOrderId(isRosterExpanded ? null : order.id)}
                      className="bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 py-1.5 px-3 rounded-lg font-black uppercase text-[10px] tracking-wider flex items-center justify-center h-8 shrink-0 transition cursor-pointer"
                    >
                      <Users size={12} /> {isRosterExpanded ? 'Ocultar' : \`Nómina (\${order.items?.length || 0})\`}
                    </button>
                  )}
                  {order.logos && order.logos.length > 0 && (
                    <button onClick={() => setViewingLogosOrderId(order.id)} className="bg-stone-800 hover:bg-stone-700 text-amber-500 border border-stone-700 py-1.5 px-3 rounded-lg font-black uppercase text-[10px] tracking-wider flex items-center justify-center h-8 shrink-0 transition">
                      <ImageIcon size={12}/> Logos ({order.logos.length})
                    </button>
                  )}
                  <button onClick={() => setViewingInvoiceId(order.id)} className="bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 py-1.5 px-3 rounded-lg font-black uppercase text-[10px] tracking-wider flex items-center justify-center h-8 shrink-0 transition">
                    <FileText size={12}/> Orden
                  </button>
                  {order.status === 'Material Listo' ? (
                    !isWriteDisabled('produccion') ? (
                      <button onClick={() => updateStatus(order.id, 'En Producción')} className="bg-purple-600 text-white py-1.5 px-3 rounded-lg font-black uppercase text-[10px] tracking-wider hover:bg-purple-500 transition shadow-lg cursor-pointer flex items-center justify-center gap-1 h-8 shrink-0">Iniciar</button>
                    ) : (
                      <span className="bg-stone-850 border border-stone-800 text-stone-500 py-1.5 px-3 rounded-lg font-black uppercase text-[10px] tracking-wider select-none flex items-center justify-center gap-1 cursor-not-allowed h-8 shrink-0">
                        Solo Lectura <Lock size={10}/>
                      </span>
                    )
                  ) : (
                    !isWriteDisabled('produccion') ? (
                      <button onClick={() => updateStatus(order.id, 'Producido')} className="bg-indigo-600 text-white py-1.5 px-3 rounded-lg font-black uppercase text-[10px] tracking-wider hover:bg-indigo-500 transition shadow-lg flex items-center justify-center gap-1 cursor-pointer h-8 shrink-0"><CheckCircle size={12}/> Terminado</button>
                    ) : (
                      <span className="bg-stone-850 border border-stone-800 text-stone-500 py-1.5 px-3 rounded-lg font-black uppercase text-[10px] tracking-wider select-none flex items-center justify-center gap-1 cursor-not-allowed h-8 shrink-0">
                        Solo Lectura <Lock size={10}/>
                      </span>
                    )
                  )}
                </div>
              </div>
              `;
    code = code.replace(headerSection, newHeader);
    console.log("Header replaced.");
} else {
    console.log("Header not found.");
}

fs.writeFileSync('src/components/views/ProductionView.tsx', code);
