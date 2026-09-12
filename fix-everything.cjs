const fs = require('fs');

function replaceAll(filePath, search, replacement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // We split and join just to be safe if there are multiple occurrences
    content = content.split(search).join(replacement);
    fs.writeFileSync(filePath, content);
  }
}

function replaceRegex(filePath, regex, replacement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content);
  }
}

// 1. HistoryView.tsx
const historySearch = `{(() => {
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
const historyReplace = `<p className="text-stone-400">Total: Bs{Number(order.totalPrice || 0).toFixed(2)}</p>
                  <p className="text-green-500">Cobrado: Bs{Number(order.amountCollected || 0).toFixed(2)}</p>
                  <p className="text-red-500">Saldo: Bs{Math.max(0, Number(order.totalPrice || 0) - Number(order.amountCollected || 0)).toFixed(2)}</p>`;
replaceAll('src/components/views/HistoryView.tsx', historySearch, historyReplace);

const historySearch2 = `Math.max(0, (order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Number(order.totalPrice) - Number(order.migrationFlatDiscount) : Number(order.totalPrice || 0))) > Number(order.amountCollected || 0) && (`;
const historyReplace2 = `Number(order.totalPrice || 0) > Number(order.amountCollected || 0) && (`;
replaceAll('src/components/views/HistoryView.tsx', historySearch2, historyReplace2);

const historySearch3 = `setManualAmount((Math.max(0, (order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Number(order.totalPrice) - Number(order.migrationFlatDiscount) : Number(order.totalPrice || 0))) - Number(order.amountCollected || 0)).toFixed(2));`;
const historyReplace3 = `setManualAmount((Number(order.totalPrice || 0) - Number(order.amountCollected || 0)).toFixed(2));`;
replaceAll('src/components/views/HistoryView.tsx', historySearch3, historyReplace3);


// 2. OperationsView.tsx
const opSearch = `<span className="text-stone-400">Total: Bs{(order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0)).toFixed(2)}</span>
                    <span className="text-green-500">Cobrado: Bs{Number(order.amountCollected || 0).toFixed(2)}</span>
                    {(() => {
                      const total = order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0);`;
const opReplace = `<span className="text-stone-400">Total: Bs{Number(order.totalPrice || 0).toFixed(2)}</span>
                    <span className="text-green-500">Cobrado: Bs{Number(order.amountCollected || 0).toFixed(2)}</span>
                    {(() => {
                      const total = Number(order.totalPrice || 0);`;
replaceAll('src/components/views/OperationsView.tsx', opSearch, opReplace);


// 3. ReporteVentasTable.tsx
const repSearch = `                  let montoTotal = Number(x.totalPrice || 0);
                  if (x.migrationFlatDiscount > 0 && x.subtotal !== undefined && Number(x.totalPrice) === Number(x.subtotal)) {
                    montoTotal = Math.max(0, montoTotal - Number(x.migrationFlatDiscount));
                  }
                  const rawCollected = Number(x.amountCollected || 0);`;
const repReplace = `                  const montoTotal = Number(x.totalPrice || 0);
                  const rawCollected = Number(x.amountCollected || 0);`;
replaceAll('src/components/views/reports/ReporteVentasTable.tsx', repSearch, repReplace);


// 4. AccountHistoryModal.tsx
const accSearch = `(order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0))`;
const accReplace = `Number(order.totalPrice || 0)`;
replaceAll('src/components/modals/AccountHistoryModal.tsx', accSearch, accReplace);


// 5. ReceiptsModal.tsx
const recSearch = `const total = order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0);`;
const recReplace = `const total = Number(order.totalPrice || 0);`;
replaceAll('src/components/modals/ReceiptsModal.tsx', recSearch, recReplace);


// 6. QuotesHistoryList.tsx
const qSearch = `const totalPrice = order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0);`;
const qReplace = `const totalPrice = Number(order.totalPrice || 0);`;
replaceAll('src/components/views/sales/QuotesHistoryList.tsx', qSearch, qReplace);

// 7. OrderReceiptDocument.tsx
const docSearch = `const currentTotal = order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || breakdownCash.subtotal) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || breakdownCash.subtotal);`;
const docReplace = `const currentTotal = Number(order.totalPrice || breakdownCash.subtotal);`;
replaceAll('src/components/ui/OrderReceiptDocument.tsx', docSearch, docReplace);

// 8. InvoiceModal.tsx
const invSearch = `const currentTotal = viewingInvoice.migrationFlatDiscount > 0 && viewingInvoice.subtotal !== undefined && Number(viewingInvoice.totalPrice) === Number(viewingInvoice.subtotal) ? Math.max(0, Number(viewingInvoice.totalPrice || breakdownCash.subtotal) - Number(viewingInvoice.migrationFlatDiscount)) : Number(viewingInvoice.totalPrice || breakdownCash.subtotal);`;
const invReplace = `const currentTotal = Number(viewingInvoice.totalPrice || breakdownCash.subtotal);`;
replaceAll('src/components/modals/InvoiceModal.tsx', invSearch, invReplace);


console.log('Reverted all visual patches successfully.');
