const fs = require('fs');
let content = fs.readFileSync('src/components/modals/newOrder/GarmentConfigurator.tsx', 'utf8');

content = content.replace(
  /else uniqueMap\.set\(s, \{ name: s, type: 'Costo Adicional', price: 0 \}\);/g,
  "else uniqueMap.set(s, { name: s, type: s.toUpperCase().includes('LOGO') ? 'Escala de Volumen (Logos)' : 'Costo Adicional', price: 0 });"
);

fs.writeFileSync('src/components/modals/newOrder/GarmentConfigurator.tsx', content);
console.log('Fallback applied in GarmentConfigurator');
