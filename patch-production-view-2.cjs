const fs = require('fs');
let code = fs.readFileSync('src/components/views/ProductionView.tsx', 'utf8');

// The first patch didn't properly add Ruler because the import match might have failed
if (!code.includes('Ruler')) {
    code = code.replace(/import\s+{([^}]+)}\s+from\s+'lucide-react';/, (match, p1) => {
        return \`import { \${p1}, Ruler, ChevronDown, ChevronUp } from 'lucide-react';\`;
    });
}

// Ensure toggleMeasurements and expandedMeasurements are in the component body
if (!code.includes('const [expandedMeasurements, setExpandedMeasurements] = useState')) {
    code = code.replace(/const \[viewingInvoiceId, setViewingInvoiceId\] = useState<string \| null>\(null\);/, 
        \`const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);
  const [expandedMeasurements, setExpandedMeasurements] = useState<Record<string, boolean>>({});

  const toggleMeasurements = (idx: string) => {
    setExpandedMeasurements(prev => ({ ...prev, [idx]: !prev[idx] }));
  };\`);
}

fs.writeFileSync('src/components/views/ProductionView.tsx', code);
