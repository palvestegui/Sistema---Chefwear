const fs = require('fs');
let content = fs.readFileSync('src/components/views/sales/ActiveOrdersList.tsx', 'utf8');

content = content.replace(
  /<p className="text-sm font-black text-stone-300">\{it\.qty\}x \{it\.name\}<\/p>/,
  `<p className="text-sm font-black text-stone-300">{it.qty}x {it.name} <span className="font-mono text-stone-500 font-bold">Bs{getItemUnitPrice(it, order.category).toFixed(2)}</span></p>`
);

fs.writeFileSync('src/components/views/sales/ActiveOrdersList.tsx', content);
