const fs = require('fs');
let content = fs.readFileSync('src/utils/pricingCalculator.ts', 'utf8');

content = content.replace(
  /'Descuento Especial \(Migración\)'/g,
  "'Descuento Aplicado'"
);

fs.writeFileSync('src/utils/pricingCalculator.ts', content);
