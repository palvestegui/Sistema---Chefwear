import sys

with open('src/types/index.ts', 'r') as f:
    content = f.read()

# Patch OrderItem
content = content.replace(
    "price?: number;",
    "price?: number;\n  logoUrl?: string;\n  embroideryType?: string;\n  logoPlacement?: string;\n  servicesPrice?: number;"
)

# Patch Order
content = content.replace(
    "paymentMethod?: string;",
    "paymentMethod?: string;\n  deliveryCity?: string;\n  logo?: string;\n  logos?: string[];\n  refImages?: string[];"
)

# Add reporting interfaces
reporting_interfaces = """
export interface GarmentStat {
  name: string;
  qty: number;
}

export interface CityStat {
  name: string;
  count: number;
  revenue: number;
}

export interface ClientStat {
  name: string;
  totalSpent: number;
  totalOrders: number;
  company?: string;
}

export interface CompanyStat {
  name: string;
  spent: number;
}

export interface SellerStat {
  name: string;
  totalSales: number;
  count: number;
}

export interface SellerArrayStat {
  name: string;
  totalSales: number;
  confirmedCount: number;
  quoteCount: number;
  totalDeals: number;
  conversionRate: number;
}

export interface SalesReportData {
  ordersCount: number;
  confirmedCount: number;
  totalConfirmedRevenue: number;
  totalCollected: number;
  totalGarments: number;
  totalServicesRevenue: number;
  averageTicket: number;
  topGarment: string;
  bestGarment: GarmentStat;
  secondBestGarment: GarmentStat;
  worstGarment: GarmentStat;
  sortedGarments: GarmentStat[];
  sortedEmbroideries: GarmentStat[];
  sortedCities: CityStat[];
  categoryRevenue: Record<string, number>;
  bestClient: ClientStat | null;
  bestCompany: CompanyStat;
  bestSeller: SellerStat;
  sellersArray: SellerArrayStat[];
}

export interface OrderLogoData {
  url: string;
  clientName: string;
  companyName?: string;
}
"""

if "SalesReportData" not in content:
    content += reporting_interfaces

with open('src/types/index.ts', 'w') as f:
    f.write(content)
