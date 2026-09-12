const fs = require('fs');
let content = fs.readFileSync('src/hooks/usePricingEngine.ts', 'utf8');

content = content.replace(
  "category === 'Alumnos UDI' || item?.category === 'UDI'",
  "category === 'Alumnos UDI' || category === 'Estudiante UDI' || item?.category === 'UDI'"
);
content = content.replace(
  "|| rawTier === 'Contrato Institucional'",
  "|| rawTier === 'Contrato Institucional' || rawTier === 'Estudiante UDI'"
);

fs.writeFileSync('src/hooks/usePricingEngine.ts', content);
