const fs = require('fs');

let content = fs.readFileSync('src/components/views/reports/ReporteVentasTable.tsx', 'utf8');

const search = `                  const montoTotal = Number(x.totalPrice || 0);
                  const rawCollected = Number(x.amountCollected || 0);`;

const replace = `                  let montoTotal = Number(x.totalPrice || 0);
                  if (x.migrationFlatDiscount > 0 && x.subtotal !== undefined && Number(x.totalPrice) === Number(x.subtotal)) {
                    montoTotal = Math.max(0, montoTotal - Number(x.migrationFlatDiscount));
                  }
                  const rawCollected = Number(x.amountCollected || 0);`;

content = content.replace(search, replace);
fs.writeFileSync('src/components/views/reports/ReporteVentasTable.tsx', content);

