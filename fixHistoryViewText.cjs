const fs = require('fs');
let code = fs.readFileSync('src/components/views/HistoryView.tsx', 'utf8');

code = code.replace(
  /<Eye size=\{12\}\/> Recibos \(\{order\.paymentHistory\.filter/g,
  '<Eye size={12}/> Ver Recibos ({order.paymentHistory.filter'
);

fs.writeFileSync('src/components/views/HistoryView.tsx', code);
