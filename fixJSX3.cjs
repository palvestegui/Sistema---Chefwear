const fs = require('fs');
let code = fs.readFileSync('src/components/modals/ContactProfileModal.tsx', 'utf8');

const old = '            <Trash2 size={14} />\n            <span>Eliminar Contacto</span>\n          </button>\n          <div className="flex items-center gap-2">\n            {onOpenEdit && (';

const newStr = `            <Trash2 size={14} />
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
          <div className="flex items-center gap-2">
            {onOpenEdit && (`

if (code.includes(old)) {
  code = code.replace(old, newStr);
  fs.writeFileSync('src/components/modals/ContactProfileModal.tsx', code);
  console.log("Success exact");
} else {
  console.log("Still not found");
}
