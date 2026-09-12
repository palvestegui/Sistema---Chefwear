const fs = require('fs');
let content = fs.readFileSync('src/components/views/sales/QuotesList.tsx', 'utf8');

content = content.replace(
  "import { StatusBadge } from '../../ui/StatusBadge';",
  "import { StatusBadge } from '../../ui/StatusBadge';\nimport { OrderReceiptDocument } from '../../ui/OrderReceiptDocument';"
);

// Add the hidden receipt
content = content.replace(
  "{/* Items */}",
  `<div className="hidden-print" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
              <OrderReceiptDocument 
                order={order} 
                getDocType={getDocType}
                formatDate={(ts) => new Date(ts).toLocaleDateString('es-BO')}
                collapseUdiItems={collapseUdiItems}
                pricing={pricing}
                getItemUnitPrice={getItemUnitPrice}
                getOrderBreakdown={getOrderBreakdown}
              />
            </div>
            {/* Items */}`
);

// Replace download calls
content = content.replace(/downloadOrderImage\(order\.id/g, "downloadOrderImage(`invoice-${order.id}`");

fs.writeFileSync('src/components/views/sales/QuotesList.tsx', content);
