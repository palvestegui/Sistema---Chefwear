const fs = require('fs');

function replaceInFile(filePath, searchPattern, replacement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(searchPattern, replacement);
    fs.writeFileSync(filePath, content);
  }
}

replaceInFile(
  'src/components/views/reports/ReporteVentasTable.tsx', 
  'const discount = Math.max(0, subtotal - montoTotal);', 
  'const explicitDiscount = Number(x.totalDiscount || x.migrationFlatDiscount || x.manualDiscount || 0);\n                  const calculatedDiscount = Math.max(0, subtotal - montoTotal);\n                  const discount = Math.max(explicitDiscount, calculatedDiscount);'
);

replaceInFile(
  'src/components/views/reports/ReportePrendasTable.tsx', 
  'const discount = Math.max(0, subtotal - montoTotal);', 
  'const explicitDiscount = Number(x.totalDiscount || x.migrationFlatDiscount || x.manualDiscount || 0);\n                  const calculatedDiscount = Math.max(0, subtotal - montoTotal);\n                  const discount = Math.max(explicitDiscount, calculatedDiscount);'
);

// Also fix useOrderCreator to save the fields properly
replaceInFile(
  'src/hooks/useOrderCreator.ts',
  'totalPrice: total,\n          status: \'Estimado\',',
  'totalPrice: total,\n          subtotal: breakdown.subtotal,\n          totalDiscount: breakdown.subtotal - breakdown.total,\n          migrationFlatDiscount: newOrder.migrationFlatDiscount || 0,\n          manualDiscount: newOrder.manualDiscount || 0,\n          status: \'Estimado\','
);

replaceInFile(
  'src/hooks/useOrderCreator.ts',
  'totalPrice: total,\n          amountCollected: collectedNum,',
  'totalPrice: total,\n          subtotal: breakdown.subtotal,\n          totalDiscount: breakdown.subtotal - breakdown.total,\n          migrationFlatDiscount: newOrder.migrationFlatDiscount || 0,\n          manualDiscount: newOrder.manualDiscount || 0,\n          amountCollected: collectedNum,'
);

