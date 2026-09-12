const fs = require('fs');
function patchFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  
  if (!content.includes('calculateVolumeScaledServiceUnitPrice')) {
    content = content.replace(
      "import { normalizeOrderData } from '../../utils/orderUtils';",
      "import { normalizeOrderData } from '../../utils/orderUtils';\nimport { calculateVolumeScaledServiceUnitPrice } from '../../utils/pricingCalculator';"
    );
    if (filename.includes('OrderReceiptDocument')) {
      content = content.replace(
        "import React from 'react';",
        "import React from 'react';\nimport { calculateVolumeScaledServiceUnitPrice } from '../../utils/pricingCalculator';"
      );
    }
  }

  const target = `const customPrice = (it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0);`;
  const replace = `const customPrice = srv?.type === 'Escala de Volumen (Logos)' ? calculateVolumeScaledServiceUnitPrice(it.qty || 1) : ((it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0));`;

  // Doing global replace just in case it appears in multiple places in the file
  content = content.replace(new RegExp(target.replace(/[.*+?^\${}()|[\\]\\]/g, '\\\\$&'), 'g'), replace);
  
  fs.writeFileSync(filename, content);
}
patchFile('src/components/ui/OrderReceiptDocument.tsx');
patchFile('src/components/modals/InvoiceModal.tsx');
