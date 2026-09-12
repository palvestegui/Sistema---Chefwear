const fs = require('fs');
let code = fs.readFileSync('src/components/views/sales/ActiveOrdersList.tsx', 'utf8');
code = code.replace("Users, Trash2", "Users, Trash2, Eye");
fs.writeFileSync('src/components/views/sales/ActiveOrdersList.tsx', code);
