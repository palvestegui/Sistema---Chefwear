const fs = require('fs');
let content = fs.readFileSync('src/components/modals/newOrder/GarmentConfigurator.tsx', 'utf8');

if (!content.includes('calculateVolumeScaledServiceUnitPrice')) {
  content = content.replace(
    "import { isServiceApplicable } from '../../../utils/serviceUtils';",
    "import { isServiceApplicable } from '../../../utils/serviceUtils';\nimport { calculateVolumeScaledServiceUnitPrice } from '../../../utils/pricingCalculator';"
  );
}

const targetPrice = `const customPrice = currentItem.customServicePrices && currentItem.customServicePrices[srv.name] !== undefined ? currentItem.customServicePrices[srv.name] : srv.price;`;
const replacePrice = `const customPrice = srv.type === 'Escala de Volumen (Logos)' ? calculateVolumeScaledServiceUnitPrice(currentItem.qty || 1) : (currentItem.customServicePrices && currentItem.customServicePrices[srv.name] !== undefined ? currentItem.customServicePrices[srv.name] : srv.price);`;

content = content.replace(targetPrice, replacePrice);
fs.writeFileSync('src/components/modals/newOrder/GarmentConfigurator.tsx', content);

console.log('Fixed customPrice in GarmentConfigurator');
