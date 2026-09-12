import sys

with open('src/hooks/useReportsEngine.ts', 'r') as f:
    content = f.read()

# 1. Imports
import_statement = """import { getOrderSellerName } from '../utils/sellerUtils';
import { 
  Order, OrderItem, PaymentEntry, PricingData, 
  SalesReportData, OrderLogoData, ClientStat 
} from '../types';"""
content = content.replace("import { getOrderSellerName } from '../utils/sellerUtils';", import_statement)

# 2. Main hook signature
content = content.replace(
    "export const useReportsEngine = (orders: any[] = [], pricing: any) => {",
    "export const useReportsEngine = (orders: Order[] = [], pricing: PricingData) => {"
)

# 3. Logo Extraction
content = content.replace(
    "const list: { url: string; clientName: string; companyName?: string }[] = [];",
    "const list: OrderLogoData[] = [];"
)
content = content.replace(
    "const addLogo = (url: any) => {",
    "const addLogo = (url: string | undefined) => {"
)
content = content.replace(
    "(o.items || []).forEach((it: any) => {",
    "(o.items || []).forEach((it: OrderItem) => {"
)

# 4. reportStats
content = content.replace(
    "const reportStats = useMemo(() => {",
    "const reportStats: SalesReportData = useMemo(() => {"
)
content = content.replace(
    "const isOrderConfirmed = (o: any) => {",
    "const isOrderConfirmed = (o: Order) => {"
)
content = content.replace(
    "o.paymentHistory.reduce((s: number, p: any) => s + Number(p.amount || 0), 0)",
    "o.paymentHistory.reduce((s: number, p: PaymentEntry) => s + Number(p.amount || 0), 0)"
)

# 5. bestClient type
content = content.replace(
    "let bestClient: any = null;",
    "let bestClient: ClientStat | null = null;"
)

with open('src/hooks/useReportsEngine.ts', 'w') as f:
    f.write(content)
