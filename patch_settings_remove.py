import re

with open('src/components/views/SettingsView.tsx', 'r') as f:
    content = f.read()

# Remove import
content = content.replace("import { MigrationModal } from '../modals/MigrationModal';", "")

# Remove state
content = content.replace("  const [showMigrationModal, setShowMigrationModal] = useState(false);\n", "")

# Remove trigger block
trigger_block = r"""      \{isSuperAdmin && \(
        <div className="mb-4">
          <button
            type="button"
            onClick=\{.*?\}
            className=".*?"
          >
            <span>📦 Importar Órdenes & CRM \(JSON\)</span>
          </button>
        </div>
      \)\}"""
content = re.sub(trigger_block, "", content, flags=re.DOTALL)

# Remove modal mount
content = re.sub(r"      \{showMigrationModal && <MigrationModal.*?/>\}\n", "", content)

# Remove unused useState if nothing else uses it
# Let's see if we should revert it to `import React, { useEffect } from 'react';`
if "useState" in content and "useState(" not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useEffect } from 'react';")

with open('src/components/views/SettingsView.tsx', 'w') as f:
    f.write(content)
