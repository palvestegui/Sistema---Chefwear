const fs = require('fs');
let code = fs.readFileSync('src/components/views/ProductionView.tsx', 'utf8');

// The drawer wrapper is:
// <div className="bg-stone-900/95 border border-amber-500/30 p-3.5 rounded-2xl mt-2 font-mono w-full min-w-[320px] sm:min-w-[380px] shadow-lg space-y-3">
code = code.replace('<div className="bg-stone-900/95 border border-amber-500/30 p-3.5 rounded-2xl mt-2 font-mono w-full min-w-[320px] sm:min-w-[380px] shadow-lg space-y-3">',
                    '<div className="bg-stone-950/90 border border-amber-500/30 p-2.5 sm:p-3 rounded-xl mt-2 font-mono w-full max-w-full overflow-hidden space-y-3">');

// Grid container: 
// <div className="grid grid-cols-4 gap-2">
code = code.replaceAll('<div className="grid grid-cols-4 gap-2">', '<div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">');

// Tile component:
// <div className="bg-stone-950/80 border border-stone-800/90 rounded-lg p-1.5 flex flex-col items-center justify-center text-center"><span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block truncate w-full">Hombros</span><span className="text-xs font-mono font-black text-amber-400 mt-0.5 whitespace-nowrap">
code = code.replaceAll('bg-stone-950/80 border border-stone-800/90 rounded-lg p-1.5 flex flex-col items-center justify-center text-center',
                       'bg-stone-900/90 border border-stone-800/80 rounded-md p-1 sm:p-1.5 flex flex-col items-center justify-center text-center w-full');

// Label class:
code = code.replaceAll('text-[9px] font-bold text-stone-400 uppercase tracking-wider block truncate w-full',
                       'text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-wider block truncate w-full');

// Value class:
code = code.replaceAll('text-xs font-mono font-black text-amber-400 mt-0.5 whitespace-nowrap',
                       'text-xs font-mono font-black text-amber-400 whitespace-nowrap mt-0.5');

fs.writeFileSync('src/components/views/ProductionView.tsx', code);
