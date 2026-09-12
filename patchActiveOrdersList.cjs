const fs = require('fs');
let code = fs.readFileSync('src/components/views/sales/ActiveOrdersList.tsx', 'utf8');

if (!code.includes('setViewingReceiptId?:')) {
  code = code.replace(
    /setCancelActiveOrderModal: \(modal: any\) => void;/g,
    "setCancelActiveOrderModal: (modal: any) => void;\n  setViewingReceiptId?: (id: string | null) => void;"
  );
  code = code.replace(
    /setCancelActiveOrderModal,/g,
    "setCancelActiveOrderModal,\n  setViewingReceiptId,"
  );
}

fs.writeFileSync('src/components/views/sales/ActiveOrdersList.tsx', code);
