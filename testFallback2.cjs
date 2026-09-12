const fs = require('fs');

let content = fs.readFileSync('src/hooks/usePricingEngine.ts', 'utf8');

content = content.replace(
  /if \(srvDef\?\.type === 'Escala de Volumen \(Logos\)'\) \{/g,
  "if (srvDef?.type === 'Escala de Volumen (Logos)' || (!srvDef && s.toUpperCase().includes('LOGO'))) {"
);

fs.writeFileSync('src/hooks/usePricingEngine.ts', content);
console.log('Fallback applied in usePricingEngine');
