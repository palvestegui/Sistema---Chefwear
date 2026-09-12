import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
const { 
  ImageIcon, FileText, CheckCircle, Lock, Building2, User, Users, ChevronDown, ChevronUp 
} = LucideIcons;
import { StatusBadge } from '../ui/StatusBadge';
import { consolidateCommercialItems } from '../../utils/orderItemConsolidation';

export interface ProductionViewProps {
  orders: any[];
  setViewingLogosOrderId: (id: string | null) => void;
  setViewingInvoiceId: (id: string | null) => void;
  isWriteDisabled: (view: string) => boolean;
  updateStatus: (id: string, status: string) => Promise<void>;
  setExpandedLogoUrl: (url: string | null) => void;
  onOpenEditRoster?: (order: any, readOnly?: boolean) => void;
}

export const ProductionView: React.FC<ProductionViewProps> = ({
  orders,
  setViewingLogosOrderId,
  setViewingInvoiceId,
  isWriteDisabled,
  updateStatus,
  setExpandedLogoUrl,
  onOpenEditRoster
}) => {
  const [expandedRosterOrderId, setExpandedRosterOrderId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 gap-8">
        {orders.filter(o => ['Material Listo', 'En Producción', 'En Confección'].includes(o.status)).map(order => {
          const isInstitutional = Boolean(order.isInstitutional || (order.institutionalRoster && order.institutionalRoster.length > 0) || (order.items || []).some((it: any) => Boolean(it.recipientName)));
          const groupedItems = consolidateCommercialItems(order.items || [], isInstitutional);
          const isRosterExpanded = expandedRosterOrderId === order.id;

          return (
            <div key={order.id} className="bg-stone-900 border border-stone-800 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col gap-6 relative">
              <div className="flex justify-between items-center flex-wrap gap-4 select-none">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-2xl text-stone-200 uppercase tracking-tighter">{order.customer}</h3>
                    {isInstitutional && (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                        <Building2 size={12} /> Institucional ({order.items?.length || 0} prendas)
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                  {isInstitutional && (
                    <button 
                      onClick={() => setExpandedRosterOrderId(isRosterExpanded ? null : order.id)}
                      className="bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Users size={14} /> {isRosterExpanded ? 'Ocultar Nómina' : `Ver Nómina (${order.items?.length || 0})`}
                    </button>
                  )}
                  {order.logos && order.logos.length > 0 && (
                    <button onClick={() => setViewingLogosOrderId(order.id)} className="bg-stone-800 hover:bg-stone-700 text-amber-500 border border-stone-700 px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-1.5 transition">
                      <ImageIcon size={14}/> Ver Logos ({order.logos.length})
                    </button>
                  )}
                  <button onClick={() => setViewingInvoiceId(order.id)} className="bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-1.5 transition">
                    <FileText size={14}/> Ver Orden Completa
                  </button>
                  {order.status === 'Material Listo' ? (
                    !isWriteDisabled('produccion') ? (
                      <button onClick={() => updateStatus(order.id, 'En Producción')} className="bg-purple-600 text-white px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-500 transition shadow-lg cursor-pointer flex items-center justify-center gap-1.5">Iniciar Producción</button>
                    ) : (
                      <span className="bg-stone-850 border border-stone-800 text-stone-500 px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest select-none flex items-center justify-center gap-1.5 cursor-not-allowed inline-flex">
                        Solo Lectura <Lock size={12}/>
                      </span>
                    )
                  ) : (
                    !isWriteDisabled('produccion') ? (
                      <button onClick={() => updateStatus(order.id, 'Producido')} className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"><CheckCircle size={14}/> Marcar Terminado</button>
                    ) : (
                      <span className="bg-stone-850 border border-stone-800 text-stone-500 px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest select-none flex items-center justify-center gap-1.5 cursor-not-allowed inline-flex">
                        Solo Lectura <Lock size={12}/>
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Grouped Production Garments Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {groupedItems.map((item: any, idx: number) => (
                  <div key={idx} className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
                    <div>
                      {item.referenceImages && item.referenceImages.length > 0 && (
                        <div className="mb-3 bg-stone-900/40 p-2 rounded-xl border border-stone-850">
                          <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest block mb-1.5">Imágenes de Referencia</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.referenceImages.map((img: any, imgIdx: number) => (
                              <div key={imgIdx} className="relative group bg-stone-950 border border-stone-850 p-1 rounded-lg flex items-center gap-1">
                                <img 
                                  src={img.url} 
                                  alt="Ref" 
                                  className="w-8 h-8 object-cover rounded border border-stone-800 cursor-zoom-in" 
                                  onClick={() => setExpandedLogoUrl(img.url)} 
                                />
                                {img.note && <span className="text-[8px] font-bold text-stone-400 max-w-[80px] truncate pr-1" title={img.note}>{img.note}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-3 pb-2 border-b border-stone-900">
                        <div>
                          <span className="font-black text-stone-200 text-base uppercase tracking-tight block">{item.name}</span>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider bg-stone-900 border border-stone-800 px-2 py-0.5 rounded font-sans">
                              {item.fabric || 'Sin tela'}{item.fabricColor ? ` • ${item.fabricColor}` : ''}
                            </span>
                            {item.size && (
                              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                                Talla: {item.size}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-amber-400 font-mono font-black text-lg">x{item.qty || 1}</span>
                      </div>

                      {item.embroideries && item.embroideries.length > 0 && (
                        <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800 space-y-1 select-none text-left">
                          <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">
                            Bordados Requeridos
                          </div>
                          <div className="flex flex-col gap-1">
                            {item.embroideries.map((emb: string, eIdx: number) => {
                              const isBolsillo = emb.toLowerCase().includes('bolsillo');
                              return (
                                <div key={eIdx} className={`text-[11px] font-bold leading-tight flex items-center gap-1.5 ${isBolsillo ? 'text-amber-400 font-black' : 'text-stone-300'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isBolsillo ? 'bg-amber-400' : 'bg-stone-600'}`}></span>
                                  <span>{emb.startsWith('Otro:') ? emb.split('|')[0].replace('Otro:', '').trim() : emb}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Roster Drawer if Expanded */}
              {isInstitutional && isRosterExpanded && (
                <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <Users size={14} /> Detalle de Nómina Individual ({order.items?.length || 0} prendas asignadas)
                    </span>
                    {onOpenEditRoster && (
                      <button
                        onClick={() => onOpenEditRoster(order, true)}
                        className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                      >
                        VER NÓMINA COMPLETA
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-80 overflow-y-auto custom-scrollbar p-1">
                    {order.items.map((item: any, itIdx: number) => (
                      <div key={itIdx} className="bg-stone-900/80 border border-stone-800/80 p-2.5 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-stone-200 truncate">{item.recipientName || `Prenda #${itIdx + 1}`}</span>
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-stone-950 px-1.5 py-0.5 rounded">{item.size || 'STD'}</span>
                        </div>
                        <p className="text-[10px] text-stone-400 truncate">{item.name} • {item.fabric || 'Drill'}</p>
                        {item.recipientNotes && (
                          <p className="text-[9px] text-amber-300/80 italic truncate">Obs: {item.recipientNotes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.notes && <div className="text-sm font-bold text-amber-500 bg-amber-950/20 p-4 rounded-xl italic">"{order.notes}"</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
