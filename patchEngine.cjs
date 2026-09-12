const fs = require('fs');
let content = fs.readFileSync('src/hooks/usePricingEngine.ts', 'utf8');

// import it
content = content.replace(
  'computeDiscountEngine,\n  DiscountEngineResult\n} from \'../utils/pricingCalculator\';',
  'computeDiscountEngine,\n  DiscountEngineResult,\n  calculateVolumeScaledServiceUnitPrice\n} from \'../utils/pricingCalculator\';'
);

const targetGetSrvCost = `    const getSrvCost = (s: string) => {
      const srvDef = pricing.services?.find((x: any) => x.name === s);
      const customPrice = (item.customServicePrices && item.customServicePrices[s] !== undefined) ? Number(item.customServicePrices[s]) : (srvDef?.price || 0);
      return Number(customPrice) || 0;
    };`;

const replaceGetSrvCost = `    const getSrvCost = (s: string) => {
      const srvDef = pricing.services?.find((x: any) => x.name === s);
      if (srvDef?.type === 'Escala de Volumen (Logos)') {
         return calculateVolumeScaledServiceUnitPrice(item.qty || 1);
      }
      const customPrice = (item.customServicePrices && item.customServicePrices[s] !== undefined) ? Number(item.customServicePrices[s]) : (srvDef?.price || 0);
      return Number(customPrice) || 0;
    };`;

content = content.replace(targetGetSrvCost, replaceGetSrvCost);

fs.writeFileSync('src/hooks/usePricingEngine.ts', content);
