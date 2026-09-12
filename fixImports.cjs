const fs = require('fs');

function fixEngine() {
  let content = fs.readFileSync('src/hooks/usePricingEngine.ts', 'utf8');
  if (!content.includes('calculateVolumeScaledServiceUnitPrice')) {
     content = content.replace(
       '} from \'../utils/pricingCalculator\';',
       '  calculateVolumeScaledServiceUnitPrice\n} from \'../utils/pricingCalculator\';'
     );
     fs.writeFileSync('src/hooks/usePricingEngine.ts', content);
  }
}

function fixModal() {
  let content = fs.readFileSync('src/components/modals/InvoiceModal.tsx', 'utf8');
  if (!content.includes('import { calculateVolumeScaledServiceUnitPrice }')) {
    content = content.replace(
      "import { normalizeOrderData } from '../../utils/orderUtils';",
      "import { normalizeOrderData } from '../../utils/orderUtils';\nimport { calculateVolumeScaledServiceUnitPrice } from '../../utils/pricingCalculator';"
    );
    fs.writeFileSync('src/components/modals/InvoiceModal.tsx', content);
  }
}

fixEngine();
fixModal();
