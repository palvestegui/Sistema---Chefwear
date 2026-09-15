const fs = require('fs');
let code = fs.readFileSync('src/components/views/ProductionView.tsx', 'utf8');

if (!code.includes('import {') || !code.includes('Ruler')) {
    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, Ruler, ChevronDown, ChevronUp} from 'lucide-react';");
}

if (!code.includes('const [expandedMeasurements, setExpandedMeasurements] = useState')) {
    code = code.replace('const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);', 
        'const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);\n  const [expandedMeasurements, setExpandedMeasurements] = useState<Record<string, boolean>>({});\n\n  const toggleMeasurements = (idx: string) => {\n    setExpandedMeasurements(prev => ({ ...prev, [idx]: !prev[idx] }));\n  };');
}

fs.writeFileSync('src/components/views/ProductionView.tsx', code);
