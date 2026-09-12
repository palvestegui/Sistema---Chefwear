const fs = require('fs');

let content = fs.readFileSync('src/components/views/HistoryView.tsx', 'utf8');

const search = `<p className="text-stone-400">Total: Bs{Number(order.totalPrice || 0).toFixed(2)}</p>
                  <p className="text-green-500">Cobrado: Bs{Number(order.amountCollected || 0).toFixed(2)}</p>
                  <p className="text-red-500">Saldo: Bs{Math.max(0, Number(order.totalPrice || 0) - Number(order.amountCollected || 0)).toFixed(2)}</p>`;

const replace = `{(() => {
                  let total = Number(order.totalPrice || 0);
                  if (order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal)) {
                    total = Math.max(0, total - Number(order.migrationFlatDiscount));
                  }
                  const collected = Number(order.amountCollected || 0);
                  const saldo = Math.max(0, total - collected);
                  return (
                    <>
                      <p className="text-stone-400">Total: Bs{total.toFixed(2)}</p>
                      <p className="text-green-500">Cobrado: Bs{collected.toFixed(2)}</p>
                      <p className="text-red-500">Saldo: Bs{saldo.toFixed(2)}</p>
                    </>
                  );
                })()}`;

content = content.replace(search, replace);

// Also need to fix the button down there
const search2 = `Number(order.totalPrice || 0) > Number(order.amountCollected || 0) && (`;
const replace2 = `Math.max(0, (order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Number(order.totalPrice) - Number(order.migrationFlatDiscount) : Number(order.totalPrice || 0))) > Number(order.amountCollected || 0) && (`;

content = content.replace(search2, replace2);

const search3 = `setManualAmount((Number(order.totalPrice || 0) - Number(order.amountCollected || 0)).toFixed(2));`;
const replace3 = `setManualAmount((Math.max(0, (order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Number(order.totalPrice) - Number(order.migrationFlatDiscount) : Number(order.totalPrice || 0))) - Number(order.amountCollected || 0)).toFixed(2));`;

content = content.replace(search3, replace3);

fs.writeFileSync('src/components/views/HistoryView.tsx', content);
