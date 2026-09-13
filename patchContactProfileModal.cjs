const fs = require('fs');

let code = fs.readFileSync('src/components/modals/ContactProfileModal.tsx', 'utf8');

// Imports
code = code.replace(
  "import { doc, deleteDoc } from 'firebase/firestore';",
  "import { doc, deleteDoc } from 'firebase/firestore';\nimport { useAuth } from '../../../contexts/AuthContext';\nimport { InlineMergeContactModal } from './InlineMergeContactModal';"
);

// State & Auth
code = code.replace(
  "  const [isDeleting, setIsDeleting] = useState(false);",
  "  const [isDeleting, setIsDeleting] = useState(false);\n  const { isSuperAdmin, isActualSuperAdmin } = useAuth();\n  const [showMergeModal, setShowMergeModal] = useState(false);"
);

// Footer left buttons
code = code.replace(
  `        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800 shrink-0">
          <button`,
  `        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
          <button`
);

code = code.replace(
  `            <Trash2 size={14} />
            <span>Eliminar Contacto</span>
          </button>
          <div className="flex items-center gap-2">
            {onOpenEdit && (`,
  `            <Trash2 size={14} />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
          
          {(isSuperAdmin || isActualSuperAdmin) && (
            <button
              type="button"
              onClick={() => setShowMergeModal(true)}
              className="px-4 py-2 text-amber-500 hover:bg-amber-950/40 border border-amber-900/50 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
            >
              <span>🔀 Fusionar Contacto</span>
            </button>
          )}
          </div>
          <div className="flex items-center gap-2">
            {onOpenEdit && (`
);

// Modal Injection
code = code.replace(
  "    </div>\n  );\n};",
  `
      {showMergeModal && (
        <InlineMergeContactModal
          contact={contact}
          onClose={() => setShowMergeModal(false)}
          onSuccess={() => {
            setShowMergeModal(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};`
);

fs.writeFileSync('src/components/modals/ContactProfileModal.tsx', code);
