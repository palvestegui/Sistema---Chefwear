const fs = require('fs');

let code = fs.readFileSync('src/components/views/sales/QuotesList.tsx', 'utf8');
code = code.replace(
  "  const { isActualSuperAdmin } = useAuth();",
  "  const { isActualSuperAdmin } = useAuth();\n  const [quoteToDelete, setQuoteToDelete] = useState<any>(null);\n  const [isDeleting, setIsDeleting] = useState(false);"
);
fs.writeFileSync('src/components/views/sales/QuotesList.tsx', code);
