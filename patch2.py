import sys

with open('src/hooks/useOrderCreator.ts', 'r') as f:
    content = f.read()

import_statement = "import { Order, PricingData } from '../types';\n"
content = import_statement + content

content = content.replace("pricing: any,", "pricing: PricingData,")
content = content.replace("editingOrder: any,", "editingOrder: Order | null,")
content = content.replace("setEditingOrder: (order: any) => void,", "setEditingOrder: (order: Order | null) => void,")
content = content.replace("setOrderToCollect: (val: any) => void,", "setOrderToCollect: (val: Order | null) => void,")
content = content.replace("setManualReceipt: (val: any) => void", "setManualReceipt: (val: string | null) => void")

with open('src/hooks/useOrderCreator.ts', 'w') as f:
    f.write(content)
