const fs = require('fs');
let content = fs.readFileSync('src/hooks/usePricingEngine.ts', 'utf8');
content = "import { calculateVolumeScaledServiceUnitPrice } from '../utils/pricingCalculator';\n" + content;
fs.writeFileSync('src/hooks/usePricingEngine.ts', content);
