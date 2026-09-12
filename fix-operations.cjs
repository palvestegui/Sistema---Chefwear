const fs = require('fs');

let content = fs.readFileSync('src/components/views/OperationsView.tsx', 'utf8');

const search = `<span className="text-stone-400">Total: Bs{Number(order.totalPrice || 0).toFixed(2)}</span>
                    <span className="text-green-500">Cobrado: Bs{Number(order.amountCollected || 0).toFixed(2)}</span>
                    {(() => {
                      const total = Number(order.totalPrice || 0);`;

const replace = `<span className="text-stone-400">Total: Bs{(order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0)).toFixed(2)}</span>
                    <span className="text-green-500">Cobrado: Bs{Number(order.amountCollected || 0).toFixed(2)}</span>
                    {(() => {
                      const total = order.migrationFlatDiscount > 0 && order.subtotal !== undefined && Number(order.totalPrice) === Number(order.subtotal) ? Math.max(0, Number(order.totalPrice || 0) - Number(order.migrationFlatDiscount)) : Number(order.totalPrice || 0);`;

content = content.replace(search, replace);
fs.writeFileSync('src/components/views/OperationsView.tsx', content);

