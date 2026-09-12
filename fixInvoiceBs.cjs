const fs = require('fs');
let content = fs.readFileSync('src/components/modals/InvoiceModal.tsx', 'utf8');

content = content.replace(/>Bs\{cashTotal/g, '><span className="normal-case">Bs</span>{cashTotal');
content = content.replace(/>Bs\{savings/g, '><span className="normal-case">Bs</span>{savings');
content = content.replace(/>Bs\{favor/g, '><span className="normal-case">Bs</span>{favor');

fs.writeFileSync('src/components/modals/InvoiceModal.tsx', content);
