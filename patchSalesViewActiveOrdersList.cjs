const fs = require('fs');
let code = fs.readFileSync('src/components/views/SalesView.tsx', 'utf8');

code = code.replace(
  "setCancelActiveOrderModal={setCancelActiveOrderModal}",
  "setCancelActiveOrderModal={setCancelActiveOrderModal}\n            setViewingReceiptId={setViewingReceiptId}"
);

fs.writeFileSync('src/components/views/SalesView.tsx', code);
