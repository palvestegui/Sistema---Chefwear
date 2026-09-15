const fs = require('fs');
let code = fs.readFileSync('src/components/views/ProductionView.tsx', 'utf8');

// The file imports everything as LucideIcons. We need to prefix the icons or add the destructured import.
if (!code.includes('import { Ruler, ChevronDown, ChevronUp } from "lucide-react";')) {
    code = code.replace("import * as LucideIcons from 'lucide-react';", "import * as LucideIcons from 'lucide-react';\nimport { Ruler, ChevronDown, ChevronUp } from 'lucide-react';");
}

if (!code.includes('const [expandedMeasurements, setExpandedMeasurements] = useState')) {
    code = code.replace('const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);', 
        'const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);\n  const [expandedMeasurements, setExpandedMeasurements] = useState<Record<string, boolean>>({});\n\n  const toggleMeasurements = (idx: string) => {\n    setExpandedMeasurements(prev => ({ ...prev, [idx]: !prev[idx] }));\n  };');
}

fs.writeFileSync('src/components/views/ProductionView.tsx', code);
