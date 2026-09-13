const fs = require('fs');

let code = fs.readFileSync('src/components/views/sales/ActiveOrdersList.tsx', 'utf8');
code = code.replace(
  "  const { isSuperAdmin, isActualSuperAdmin } = useAuth();",
  "  const { isSuperAdmin, isActualSuperAdmin } = useAuth();\n  const [orderToRevert, setOrderToRevert] = useState<any>(null);\n  const [isReverting, setIsReverting] = useState(false);"
);
fs.writeFileSync('src/components/views/sales/ActiveOrdersList.tsx', code);
