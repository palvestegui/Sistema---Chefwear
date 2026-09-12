const fs = require('fs');

function patchFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');

  // In the filter:
  content = content.replace(
    /return srv && \(srv.type === 'Costo Adicional' \|\| srv.type === 'Costo Adicional Editable' \|\| srv.type === 'Escala de Volumen \(Logos\)'\);/g,
    "return (!srv && s.toUpperCase().includes('LOGO')) || (srv && (srv.type === 'Costo Adicional' || srv.type === 'Costo Adicional Editable' || srv.type === 'Escala de Volumen (Logos)'));"
  );

  // In the mapping (to determine type):
  content = content.replace(
    /const customPrice = srv\?\.type === 'Escala de Volumen \(Logos\)' \? calculateVolumeScaledServiceUnitPrice\(it\.qty \|\| 1\) : \(\(it\.customServicePrices && it\.customServicePrices\[s\] !== undefined\) \? Number\(it\.customServicePrices\[s\]\) : \(srv\?\.price \|\| 0\)\);/g,
    "const isLogoFallback = !srv && s.toUpperCase().includes('LOGO');\n                           const customPrice = (srv?.type === 'Escala de Volumen (Logos)' || isLogoFallback) ? calculateVolumeScaledServiceUnitPrice(it.qty || 1) : ((it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0));"
  );

  fs.writeFileSync(filename, content);
}

patchFile('src/components/ui/OrderReceiptDocument.tsx');
patchFile('src/components/modals/InvoiceModal.tsx');
// Also OrderSummaryAndCheckout
let sumContent = fs.readFileSync('src/components/modals/newOrder/OrderSummaryAndCheckout.tsx', 'utf8');
sumContent = sumContent.replace(
  /return srv && \(srv.type === 'Costo Adicional' \|\| srv.type === 'Costo Adicional Editable' \|\| srv.type === 'Escala de Volumen \(Logos\)'\);/g,
  "return (!srv && s.toUpperCase().includes('LOGO')) || (srv && (srv.type === 'Costo Adicional' || srv.type === 'Costo Adicional Editable' || srv.type === 'Escala de Volumen (Logos)'));"
);
sumContent = sumContent.replace(
  /const customPrice = srv\?\.type === 'Escala de Volumen \(Logos\)' \? calculateVolumeScaledServiceUnitPrice\(it\.qty \|\| 1\) : \(\(it\.customServicePrices && it\.customServicePrices\[s\] !== undefined\) \? Number\(it\.customServicePrices\[s\]\) : \(srv\?\.price \|\| 0\)\);/g,
  "const isLogoFallback = !srv && s.toUpperCase().includes('LOGO');\n                          const customPrice = (srv?.type === 'Escala de Volumen (Logos)' || isLogoFallback) ? calculateVolumeScaledServiceUnitPrice(it.qty || 1) : ((it.customServicePrices && it.customServicePrices[s] !== undefined) ? Number(it.customServicePrices[s]) : (srv?.price || 0));"
);
fs.writeFileSync('src/components/modals/newOrder/OrderSummaryAndCheckout.tsx', sumContent);

console.log('Fallback applied');
