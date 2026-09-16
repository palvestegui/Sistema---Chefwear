const fs = require('fs');

let code = fs.readFileSync('src/components/views/ProductionView.tsx', 'utf8');

const startMarker = `{/* MOBILE CARD ( < lg ) */}`;
const endMarker = `      </div>\n    </div>\n  );\n};\n`;

const startIndex = code.indexOf(startMarker);
const beforeMobileCard = code.substring(0, startIndex);

const mobileCardCode = `      {/* MOBILE CARD ( < lg ) */}
      <div className="lg:hidden flex flex-col gap-4">
        {orders.filter(o => ['Material Listo', 'En Producción', 'En Confección'].includes(o.status)).map(order => {
          const isInst = Boolean(order.isInstitutional || order.institutionalRoster?.length > 0 || order.items?.some((it:any) => Boolean(it.recipientName)));
          const items = consolidateCommercialItems(order.items || [], isInst);
          const isRosterExpanded = expandedRosterOrderId === order.id;
          
          return (
            <React.Fragment key={order.id}>
              {items.map((item, idx) => {
                const { isCustom, filMeasurements, panMeasurements, showFil, showPan, hasDirectSpecs } = getGarmentSpecs(order, item);
                const k = \`\${order.id}-\${idx}\`;
                return (
                  <div key={k} className="h-auto flex flex-col gap-2 p-3.5 sm:p-4 rounded-2xl bg-stone-900 border border-stone-800 w-full">
                    
                    {/* Row A (Customer Name & Status) */}
                    <div className="flex items-center justify-between gap-2 w-full border-b border-stone-800/60 pb-1.5">
                      <h3 className="font-black text-base sm:text-lg text-stone-100 uppercase tracking-tight leading-tight">
                        {order.customer}
                      </h3>
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Row B (Garment Summary & Buttons) */}
                    <div className="flex items-center justify-between gap-2 w-full py-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-xs text-stone-200 uppercase truncate">{item.name}</span>
                        <span className="text-[10px] text-amber-500 bg-stone-950 px-1.5 py-0.5 rounded border border-stone-800 font-sans">x{item.qty || 1}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => setViewingInvoiceId(order.id)} className="bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 h-7 px-2 rounded-lg font-black uppercase text-[10px] tracking-wider transition shrink-0 flex items-center justify-center">📄 ORDEN</button>
                        
                        {order.status === 'Material Listo' ? (
                          !isWriteDisabled('produccion') && (
                            <button onClick={() => updateStatus(order.id, 'En Producción')} className="bg-purple-600 text-white h-7 px-2.5 rounded-lg font-black uppercase text-[10px] tracking-wider hover:bg-purple-500 transition shadow-lg flex items-center justify-center gap-1 shrink-0">▶ INICIAR</button>
                          )
                        ) : (
                          !isWriteDisabled('produccion') && (
                            <button onClick={() => updateStatus(order.id, 'Producido')} className="bg-indigo-600 text-white h-7 px-2.5 rounded-lg font-black uppercase text-[10px] tracking-wider hover:bg-indigo-500 transition shadow-lg flex items-center justify-center gap-1 shrink-0"><CheckCircle size={12}/> TERMINAR</button>
                          )
                        )}
                        
                        {isCustom && (
                          <button 
                            onClick={() => toggleMeasurements(k)}
                            className="h-7 px-2.5 text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/40 rounded-lg flex items-center gap-1 uppercase transition hover:bg-amber-950/50 shrink-0"
                          >
                            <Ruler size={10}/> MEDIDAS {expandedMeasurements[k] ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* REMAINDER: Drawer, Size, Ref Images */}
                    <div className="flex flex-col w-full">
                      {item.referenceImages && item.referenceImages.length > 0 && (
                        <div className="mt-2 mb-1 bg-stone-900/40 p-2 rounded-xl border border-stone-850">
                          <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest block mb-1.5">Ref</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.referenceImages.map((img: any, imgIdx: number) => (
                              <div key={imgIdx} className="relative group bg-stone-950 border border-stone-850 p-1 rounded-lg flex items-center gap-1">
                                <img src={img.url} alt="Ref" className="w-8 h-8 object-cover rounded border border-stone-800 cursor-zoom-in" onClick={() => setExpandedLogoUrl(img.url)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {expandedMeasurements[k] && isCustom && (
                        <div className="bg-stone-950/90 border border-amber-500/30 p-2.5 rounded-xl w-full mt-2">
                          <div className={\`grid \${showFil && showPan ? 'grid-cols-2' : 'grid-cols-1'} gap-3 w-full\`}>
                            {showFil && (
                              <div className="w-full">
                                <MobileMeasurementGrid label="👘 FILIPINA" specs={filMeasurements} isPan={false} colsOverride="grid-cols-4" />
                              </div>
                            )}
                            {showPan && (
                              <div className="w-full">
                                <MobileMeasurementGrid label="👖 PANTALÓN" specs={panMeasurements} isPan={true} colsOverride="grid-cols-2" />
                              </div>
                            )}
                            {(!showFil && !showPan && hasDirectSpecs) && (
                              <div className="w-full col-span-full">
                                <span className="text-[10px] font-black text-amber-500 mb-1.5 block">MEDIDAS</span>
                                <div className="grid grid-cols-4 gap-1.5 w-full">
                                  {Object.entries(item.measurements).filter(([_, v]) => v && String(v).trim() !== '' && String(v).trim() !== '0').map(([mk, mv]) => (
                                    <div key={mk} className="bg-stone-900/90 border border-stone-800/80 rounded-md p-1.5 flex flex-col items-center justify-center text-center w-full">
                                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block truncate w-full">{mk}</span>
                                      <span className="text-xs font-mono font-black text-amber-400 whitespace-nowrap mt-0.5">{String(mv)} cm</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {!isCustom && (
                        <div className="mt-2 w-full">
                          <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-md inline-block">
                            Talla: {item.size || 'STD'}
                          </span>
                        </div>
                      )}

                      {item.embroideries && item.embroideries.length > 0 && (
                        <div className="bg-stone-900/60 p-2 rounded-lg border border-stone-800 mt-2 w-full">
                          <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Bordados</div>
                          <div className="text-[10px] text-amber-400/90 font-bold truncate">
                            {item.embroideries.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* ROSTER */}
              {isInst && isRosterExpanded && (
                <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl space-y-3 shrink-0">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Users size={12} /> Nómina ({order.items?.length || 0})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {order.items.map((it: any, itIdx: number) => (
                      <div key={itIdx} className="bg-stone-900/80 border border-stone-800/80 p-2 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-stone-200 truncate">{it.recipientName || \`#\${itIdx + 1}\`}</span>
                          <span className="text-[9px] font-mono font-bold text-amber-400 bg-stone-950 px-1 py-0.5 rounded">{it.size || 'STD'}</span>
                        </div>
                        <p className="text-[9px] text-stone-400 truncate">{it.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/views/ProductionView.tsx', beforeMobileCard + mobileCardCode);
