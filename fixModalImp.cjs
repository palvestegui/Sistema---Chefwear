const fs = require('fs');
let content = fs.readFileSync('src/components/modals/InvoiceModal.tsx', 'utf8');
content = "import { calculateVolumeScaledServiceUnitPrice } from '../../utils/pricingCalculator';\n" + content;
fs.writeFileSync('src/components/modals/InvoiceModal.tsx', content);
