import sys

with open('src/utils/csvFormatters.ts', 'r') as f:
    content = f.read()

old_import = "import { getOrderSellerName } from './sellerUtils';"
new_import = """import { getOrderSellerName } from './sellerUtils';
import { Order, OrderItem, PricingData, ServicePricing } from '../types';
import { OrderBreakdown } from '../hooks/useOrderSubmission';

export interface CsvOrderHeaderRow {
  orderId?: string;
  payerAccountId: string;
  salespersonName: string;
  orderDate: string;
  orderStatus: string;
  productionStatus: string;
  subtotal: number;
  volumeDiscount: number;
  cashDiscount: number;
  manualDiscount: number;
  totalGeneral: number;
  amountPaid: number;
  cashBalance: number;
  rawOrder: Order;
}

export interface CsvOrderLineItemRow {
  lineItemId: string;
  orderId?: string;
  wearerContactId: string;
  garmentCategory: string;
  garmentType: string;
  fabricSelected: string;
  sizingMode: string;
  sizeValue: string;
  quantity: number;
  unitBasePrice: number;
  lineSubtotal: number;
  itemData: OrderItem;
  rawOrder: Order;
}

export interface CsvLineItemModifierRow {
  modifierId: string;
  lineItemId: string;
  serviceName: string;
  serviceType: string;
  customTextPlacement: string;
  unitCost: number;
  quantity: number;
  modifierSubtotal: number;
  rawOrder: Order;
}"""
content = content.replace(old_import, new_import)

content = content.replace("filteredOrders: any[],", "filteredOrders: Order[],")
content = content.replace(
    "getOrderBreakdown: (items: any[], category: string, paymentMethod: string, manualDiscount: number, clientType?: string, accountId?: string, migrationFlatDiscount?: number) => any",
    "getOrderBreakdown: (items: OrderItem[], category: string, paymentMethod: string, manualDiscount: number, clientType?: string, accountId?: string, migrationFlatDiscount?: number) => OrderBreakdown"
)
content = content.replace(") => {", "): CsvOrderHeaderRow[] => {", 1)

content = content.replace("(l: any)", "(l: { label: string; amount: number })")
content = content.replace("getItemUnitPrice: (item: any,", "getItemUnitPrice: (item: OrderItem,")

content = content.replace(") => {\n  const lineItems: any[] = [];", "): CsvOrderLineItemRow[] => {\n  const lineItems: CsvOrderLineItemRow[] = [];")
content = content.replace("(it: any, idx: number)", "(it: OrderItem, idx: number)")
content = content.replace("const cleanId = x.id.replace(/^ORD-/, '');", "const cleanId = (x.id || '').replace(/^ORD-/, '');")

content = content.replace("pricing: any\n) => {\n  const modifiers: any[] = [];", "pricing: PricingData\n): CsvLineItemModifierRow[] => {\n  const modifiers: CsvLineItemModifierRow[] = [];")
content = content.replace("(s: any)", "(s: ServicePricing)")

with open('src/utils/csvFormatters.ts', 'w') as f:
    f.write(content)
