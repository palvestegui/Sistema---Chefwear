const fs = require('fs');
let code = fs.readFileSync('src/components/modals/ContactProfileModal.tsx', 'utf8');

const targetStr = `            <Trash2 size={14} />
            <span>Eliminar Contacto</span>
          </button>
          <div className="flex items-center gap-2">`;

const replacementStr = `            <Trash2 size={14} />
            <span className="hidden sm:inline">Eliminar Contacto</span>
          </button>
          
          {(isSuperAdmin || isActualSuperAdmin) && (
            <button
              type="button"
              onClick={() => setShowMergeModal(true)}
              className="px-4 py-2 text-amber-500 hover:bg-amber-950/40 border border-amber-900/50 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
            >
              <span className="hidden sm:inline">🔀 Fusionar Contacto</span>
              <span className="sm:hidden">🔀 Fusionar</span>
            </button>
          )}
          </div>
          <div className="flex items-center gap-2">`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('src/components/modals/ContactProfileModal.tsx', code);
  console.log("Success");
} else {
  console.log("Target not found!");
}
