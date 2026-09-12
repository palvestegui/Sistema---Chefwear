import re

with open('src/components/views/SettingsView.tsx', 'r') as f:
    content = f.read()

# 1. Imports
if "import { MigrationModal }" not in content:
    content = content.replace(
        "import { UsersManagementSection } from './settings/UsersManagementSection';",
        "import { UsersManagementSection } from './settings/UsersManagementSection';\nimport { MigrationModal } from '../modals/MigrationModal';"
    )

if "useState" not in content:
    content = content.replace("import React, { useEffect } from 'react';", "import React, { useState, useEffect } from 'react';")
else:
    # already has useState, let's make sure it has useEffect too if needed, but it should.
    pass

# 2. State
state_decl = "const [showMigrationModal, setShowMigrationModal] = useState(false);"
if state_decl not in content:
    content = content.replace(
        "const { userProfile, isSuperAdmin, isAdmin } = useAuth();",
        "const { userProfile, isSuperAdmin, isAdmin } = useAuth();\n  const [showMigrationModal, setShowMigrationModal] = useState(false);"
    )

# 3. Trigger button
trigger_html = """
      {isSuperAdmin && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowMigrationModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition-all"
          >
            <span>📦 Importar Órdenes & CRM (JSON)</span>
          </button>
        </div>
      )}
"""
if "📦 Importar Órdenes & CRM" not in content:
    content = content.replace(
        '<div className="w-full space-y-6 animate-in fade-in pb-12">',
        f'<div className="w-full space-y-6 animate-in fade-in pb-12">{trigger_html}'
    )

# 4. Modal mount
modal_html = "\n      {showMigrationModal && <MigrationModal onClose={() => setShowMigrationModal(false)} />}\n    </div>\n  );\n};"
content = re.sub(r"\n    </div>\n  \);\n};\n?$", modal_html, content)

with open('src/components/views/SettingsView.tsx', 'w') as f:
    f.write(content)
