with open('src/components/views/settings/DangerZoneSection.tsx', 'r') as f:
    content = f.read()

# Replace the specific import line completely
import_lucide = "import { Trash2, Flame, History } from 'lucide-react';"
if import_lucide in content:
    content = content.replace(import_lucide, "import { Trash2, Flame, History, Database } from 'lucide-react';\nimport { MigrationModal } from '../../modals/MigrationModal';")

with open('src/components/views/settings/DangerZoneSection.tsx', 'w') as f:
    f.write(content)
