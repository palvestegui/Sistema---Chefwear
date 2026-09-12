import re

with open('src/components/views/settings/DangerZoneSection.tsx', 'r') as f:
    content = f.read()

# Fix imports
if "useState" not in content:
    content = content.replace("import React from 'react';", "import React, { useState } from 'react';")
if "Database" not in content:
    content = content.replace("import { Trash2, Flame, History } from 'lucide-react';", "import { Trash2, Flame, History, Database } from 'lucide-react';\nimport { MigrationModal } from '../../modals/MigrationModal';")

# Add state
if "const [showMigrationModal, setShowMigrationModal] = useState(false);" not in content:
    content = content.replace(
        "}) => {", 
        "}) => {\n  const [showMigrationModal, setShowMigrationModal] = useState(false);\n"
    )

with open('src/components/views/settings/DangerZoneSection.tsx', 'w') as f:
    f.write(content)
