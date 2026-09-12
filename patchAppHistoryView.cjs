const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "setManualReceipt={setManualReceipt} setViewingHistoryOrderId={setViewingHistoryOrderId}",
  "setManualReceipt={setManualReceipt} setViewingHistoryOrderId={setViewingHistoryOrderId} setViewingReceiptId={setViewingReceiptId}"
);

fs.writeFileSync('src/App.tsx', code);
