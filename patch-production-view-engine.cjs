const fs = require('fs');

let code = fs.readFileSync('src/components/views/ProductionView.tsx', 'utf8');

// Replace the size badge and measurement block rendering.
const targetRegex = /\{item\.size && !hasMeasurements[\s\S]*?\}\s*<\/div>\s*\);\s*\}\)\(\)\}/g;

const startIdx = code.indexOf('{(() => {\n                              const hasMeasurements = item.measurements');
const endIdx = code.indexOf('})()}', startIdx) + 5;

const block2Start = code.indexOf('{(() => {\n                        const hasMeasurements = item.measurements', endIdx);
const block2End = code.indexOf('})()}', block2Start) + 5;

// We will inject the logic at the start of the groupedItems.map block, replacing the old IIFEs.
let newMapContent = code.substring(code.indexOf('groupedItems.map((item: any, idx: number) => {'), code.indexOf('groupedItems.map((item: any, idx: number) => ('));

const mapStart = code.indexOf('groupedItems.map((item: any, idx: number) => (');

if (mapStart !== -1) {
    let replaced = code.substring(0, mapStart);
    replaced += `groupedItems.map((item: any, idx: number) => {
                  
                  // 1. Resolve Filipina Specs (8 Points)
                  const filSibling = (order.items || []).find((it: any) => it.name?.toLowerCase().includes('filipina'));
                  const filMeasurements = (filSibling?.measurements && Object.keys(filSibling.measurements).length > 0)
                    ? filSibling.measurements
                    : (item.name?.toLowerCase().includes('filipina') && item.measurements ? item.measurements : (order.measurements?.filipina || order.measurements || order.contact?.measurements?.filipina || order.contact?.measurements || null));

                  // 2. Resolve Pantalón Specs (4 Points)
                  const panSibling = (order.items || []).find((it: any) => it.name?.toLowerCase().includes('pantalon') || it.name?.toLowerCase().includes('pantalón'));
                  const panMeasurements = (panSibling?.measurements && Object.keys(panSibling.measurements).length > 0)
                    ? panSibling.measurements
                    : ((item.name?.toLowerCase().includes('pantalon') || item.name?.toLowerCase().includes('pantalón')) && item.measurements ? item.measurements : (order.measurements?.pantalon || order.measurements || order.contact?.measurements?.pantalon || order.contact?.measurements || null));

                  // 3. Helper to verify if measurements have real values
                  const hasValues = (obj: any) => obj && Object.values(obj).some((v: any) => v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== '0');

                  const hasFilSpecs = hasValues(filMeasurements);
                  const hasPanSpecs = hasValues(panMeasurements);
                  const hasDirectSpecs = hasValues(item.measurements);
                  
                  // Specific overrides for bundled uniforms
                  const isBundle = item.name?.toLowerCase().includes('completo udi');
                  const isFilipina = item.name?.toLowerCase().includes('filipina');
                  const isPantalon = item.name?.toLowerCase().includes('pantal');
                  
                  const showFil = hasFilSpecs && (isBundle || isFilipina);
                  const showPan = hasPanSpecs && (isBundle || isPantalon);
                  
                  const isCustom = showFil || showPan || (hasDirectSpecs && !isFilipina && !isPantalon && !isBundle);

                  return (`;
    
    // Find the end of the map
    const innerContentEnd = code.lastIndexOf('))}');
    let innerContent = code.substring(mapStart + 'groupedItems.map((item: any, idx: number) => ('.length, innerContentEnd);
    
    // Remove the old IIFE blocks
    
    // Size badge replace
    const sizeBadgeRegex = /\{\(\(\) => \{[\s\S]*?\}\)\(\)\}/;
    
    // We will do two manual replacements.
    // Replace size badge block:
    let iifeStart1 = innerContent.indexOf('{(() => {\n                              const hasMeasurements');
    if (iifeStart1 === -1) {
        // Fallback search
        iifeStart1 = innerContent.indexOf('{(() => {');
    }
    
    if (iifeStart1 !== -1) {
        let iifeEnd1 = innerContent.indexOf('})()}', iifeStart1) + 5;
        
        let newSizeBadge = `
                                  {item.size && !isCustom && (
                                    <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                                      Talla: {item.size}
                                    </span>
                                  )}
                                  {isCustom && (
                                    <span className="text-[10px] font-black uppercase text-stone-900 bg-amber-400 border border-amber-500 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                                      <Ruler size={10} /> A MEDIDA
                                    </span>
                                  )}
        `;
        innerContent = innerContent.substring(0, iifeStart1) + newSizeBadge + innerContent.substring(iifeEnd1);
    }
    
    // Replace drawer block:
    let iifeStart2 = innerContent.indexOf('{(() => {\n                        const hasMeasurements');
    if (iifeStart2 === -1) {
        // Find next IIFE
        iifeStart2 = innerContent.indexOf('{(() => {');
    }
    
    if (iifeStart2 !== -1) {
        let iifeEnd2 = innerContent.indexOf('})()}', iifeStart2) + 5;
        
        let newDrawer = `
                      {isCustom && (
                        <div className="mb-3">
                          <button 
                            onClick={() => toggleMeasurements(\`\${order.id}-\${idx}\`)}
                            className="w-full flex items-center justify-between bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-500 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition"
                          >
                            <span className="flex items-center gap-2"><Ruler size={12}/> Medidas de Taller</span>
                            {expandedMeasurements[\`\${order.id}-\${idx}\`] ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                          </button>
                          
                          {expandedMeasurements[\`\${order.id}-\${idx}\`] && (
                            <div className="bg-stone-900/90 border border-amber-500/30 p-3 rounded-xl mt-2 font-mono text-xs space-y-3">
                              {showFil && (
                                <div>
                                  <span className="text-[10px] font-black text-amber-500 mb-1.5 block">👘 FILIPINA</span>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Hombros</span><span className="text-amber-400 font-bold">{filMeasurements.hombros || filMeasurements.F_Hombros || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Cuello</span><span className="text-amber-400 font-bold">{filMeasurements.cuello || filMeasurements.F_Cuello || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Pecho/Torso</span><span className="text-amber-400 font-bold">{filMeasurements.anchoTorso || filMeasurements.F_Ancho_Torso || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Lgo Torso</span><span className="text-amber-400 font-bold">{filMeasurements.largoTorso || filMeasurements.F_Largo_Torso || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Cintura</span><span className="text-amber-400 font-bold">{filMeasurements.cintura || filMeasurements.F_Cintura || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Cadera</span><span className="text-amber-400 font-bold">{filMeasurements.cadera || filMeasurements.F_Cadera || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Lgo Brazo</span><span className="text-amber-400 font-bold">{filMeasurements.largoBrazo || filMeasurements.F_Largo_Brazo || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Ancho Brazo</span><span className="text-amber-400 font-bold">{filMeasurements.anchoBrazo || filMeasurements.F_Ancho_Brazo || '—'} cm</span></div>
                                  </div>
                                </div>
                              )}
                              
                              {showPan && (
                                <div className={showFil ? "pt-2 border-t border-stone-800" : ""}>
                                  <span className="text-[10px] font-black text-amber-500 mb-1.5 block">👖 PANTALÓN</span>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Cintura</span><span className="text-amber-400 font-bold">{panMeasurements.cintura || panMeasurements.P_Cintura || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Cadera</span><span className="text-amber-400 font-bold">{panMeasurements.cadera || panMeasurements.P_Cadera || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Ancho Pierna</span><span className="text-amber-400 font-bold">{panMeasurements.anchoPierna || panMeasurements.P_Ancho_Pierna || '—'} cm</span></div>
                                    <div className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Lgo Pierna</span><span className="text-amber-400 font-bold">{panMeasurements.largoPierna || panMeasurements.P_Largo_Pierna || '—'} cm</span></div>
                                  </div>
                                </div>
                              )}
                              
                              {(!showFil && !showPan && hasDirectSpecs) && (
                                <div>
                                  <span className="text-[10px] font-black text-amber-500 mb-1.5 block">MEDIDAS</span>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {Object.entries(item.measurements).filter(([_, v]) => v && String(v).trim() !== '' && String(v).trim() !== '0').map(([k, v]) => (
                                      <div key={k} className="flex flex-col"><span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">{k}</span><span className="text-amber-400 font-bold">{String(v)} cm</span></div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
        `;
        
        innerContent = innerContent.substring(0, iifeStart2) + newDrawer + innerContent.substring(iifeEnd2);
    }
    
    replaced += innerContent + `);
                })}
              </div>`;
              
    replaced += code.substring(innerContentEnd + 3);
    
    fs.writeFileSync('src/components/views/ProductionView.tsx', replaced);
}

