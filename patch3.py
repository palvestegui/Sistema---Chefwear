import sys

with open('src/hooks/useOrderState.ts', 'r') as f:
    content = f.read()

import_statement = "import { Order, OrderItem } from '../types';\n"
content = import_statement + content

content = content.replace("export const useOrderState = (editingOrder: any, setEditingOrder: (order: any) => void) => {", "export const useOrderState = (editingOrder: Order | null, setEditingOrder: (order: Order | null) => void) => {")
content = content.replace("useState<any>(INITIAL_ORDER_STATE)", "useState<Order>(INITIAL_ORDER_STATE as Order)")
content = content.replace("useState<any>(INITIAL_ITEM_STATE)", "useState<OrderItem>(INITIAL_ITEM_STATE as OrderItem)")

with open('src/hooks/useOrderState.ts', 'w') as f:
    f.write(content)
