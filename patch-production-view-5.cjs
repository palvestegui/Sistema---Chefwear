const fs = require('fs');
let code = fs.readFileSync('src/components/views/ProductionView.tsx', 'utf8');

// Fix imports
code = code.replace("import { Ruler, ChevronDown, ChevronUp } from 'lucide-react';", "import { Ruler } from 'lucide-react';");

// Ensure toggleMeasurements and expandedMeasurements exist
if (!code.includes('const [expandedMeasurements, setExpandedMeasurements] = useState')) {
    code = code.replace('const [expandedRosterOrderId, setExpandedRosterOrderId] = useState<string | null>(null);', 
        'const [expandedRosterOrderId, setExpandedRosterOrderId] = useState<string | null>(null);\n  const [expandedMeasurements, setExpandedMeasurements] = useState<Record<string, boolean>>({});\n\n  const toggleMeasurements = (idx: string) => {\n    setExpandedMeasurements(prev => ({ ...prev, [idx]: !prev[idx] }));\n  };');
}

fs.writeFileSync('src/components/views/ProductionView.tsx', code);
