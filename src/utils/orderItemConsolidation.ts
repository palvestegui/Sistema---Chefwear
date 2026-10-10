/**
 * Commercial Order Item Consolidator
 * 
 * Aggregates order line items for professional commercial presentation
 * (Quotations, Customer Invoices, Active Order Cards, Operations).
 * 
 * Decoupled from UDI domain logic. Agnostic across retail, corporate B2B,
 * and institutional employee rosters.
 */

import { OrderItem } from '../types';
import { collapseUdiStudentPackage } from '../domains/udi/udiBundleEngine';

export interface ConsolidatedLineItem extends OrderItem {
  isConsolidatedGroup?: boolean;
  individualNamesCount?: number;
  rosterSummaryLabel?: string;
  itemIndices?: number[];
}

/**
 * Normalizes a string for group hashing.
 */
const cleanKeyPart = (val: unknown): string =>
  String(val ?? '').trim().toLowerCase();

/**
 * Consolidates order items sharing model, fabric, color, and service profile.
 * In institutional orders, individual employee pocket names are unified so they
 * do not fracture the line items on commercial quotes and invoices.
 */
export const consolidateCommercialItems = (
  items: OrderItem[],
  isInstitutional?: boolean
): ConsolidatedLineItem[] => {
  if (!items || items.length === 0) return [];

  // Pass 1: If any items belong to an uncollapsed UDI student set, bundle them into Uniforme Completo UDI first
  const hasUdiBundleItems = items.some(it => it.isUdiGroup && it.udiGroupId);
  const normalizedItems = hasUdiBundleItems ? collapseUdiStudentPackage(items) : items;

  // Pass 2: Agnostic Commercial Consolidation
  const consolidatedMap = new Map<string, ConsolidatedLineItem>();

  normalizedItems.forEach((it, index) => {
    const nameKey = cleanKeyPart(it.name);
    const fabricKey = cleanKeyPart(it.fabric);
    const colorKey = cleanKeyPart(it.fabricColor);
    const tierKey = cleanKeyPart(it.pricingTier);
    const catKey = cleanKeyPart(it.category);
    const customPriceKey = cleanKeyPart(it.customUnitPrice);

    // Sort services to ensure identical set matching
    const servicesArr = Array.isArray(it.services) ? [...it.services].sort() : [];
    const srvKey = servicesArr.join('|');

    // In institutional orders, pocket names are employee-specific and must NOT fracture the commercial row
    let embKey = '';
    if (!isInstitutional) {
      const embroideriesArr = Array.isArray(it.embroideries) ? [...it.embroideries].sort() : [];
      embKey = embroideriesArr.join('|') + '_' + cleanKeyPart(it.pocketName);
    }

    const groupKey = `${nameKey}_${fabricKey}_${colorKey}_${tierKey}_${catKey}_${srvKey}_${embKey}_${customPriceKey}`;
    const qty = Number(it.qty) || 1;
    const hasIndividualName = Boolean(it.pocketName && it.pocketName.trim().length > 0);

    if (!consolidatedMap.has(groupKey)) {
      const initialItem: ConsolidatedLineItem = {
        ...it,
        qty,
        isConsolidatedGroup: false,
        individualNamesCount: hasIndividualName ? qty : 0,
        itemIndices: [index]
      };
      consolidatedMap.set(groupKey, initialItem);
    } else {
      const existing = consolidatedMap.get(groupKey)!;
      existing.qty = (Number(existing.qty) || 0) + qty;
      existing.isConsolidatedGroup = true;
      existing.itemIndices?.push(index);

      if (hasIndividualName) {
        existing.individualNamesCount = (existing.individualNamesCount || 0) + qty;
      }

      // Merge services uniquely
      if (it.services && it.services.length > 0) {
        const mergedServices = new Set([...(existing.services || []), ...it.services]);
        existing.services = Array.from(mergedServices);
      }

      // Merge customServicePrices
      if (it.customServicePrices) {
        existing.customServicePrices = {
          ...(existing.customServicePrices || {}),
          ...it.customServicePrices
        };
      }

      // Merge reference images
      if (it.referenceImages && it.referenceImages.length > 0) {
        const existingUrls = new Set((existing.referenceImages || []).map(r => r.url));
        const newImgs = it.referenceImages.filter(r => !existingUrls.has(r.url));
        existing.referenceImages = [...(existing.referenceImages || []), ...newImgs];
      }
    }
  });

  // Pass 3: Finalize institutional labels and pocket summaries
  const result: ConsolidatedLineItem[] = [];

  consolidatedMap.forEach(item => {
    if (isInstitutional && (item.individualNamesCount || 0) > 0) {
      const count = item.individualNamesCount || item.qty;
      item.pocketName = `Nómina (${count} personas)`;
      item.rosterSummaryLabel = `Incluye bordado de nombre por nómina (${count} personas)`;
    }
    result.push(item);
  });

  return result;
};

export interface EmbroiderySourceItem {
  pocketName?: string;
  embroideries?: string[];
  services?: string[];
}

/**
 * Resolves all required embroideries and pocket names for an item,
 * consolidating explicit embroideries, services, and pocketName.
 */
export const resolveItemEmbroideries = (
  item: EmbroiderySourceItem | null | undefined
): string[] => {
  if (!item) return [];
  const result: string[] = [];
  const pocket = (item.pocketName || '').trim();

  // 1. Process explicit embroideries
  if (Array.isArray(item.embroideries)) {
    item.embroideries.forEach((emb: string) => {
      if (typeof emb === 'string' && emb.trim()) {
        if (emb.toLowerCase().includes('bolsillo') && pocket) {
          result.push(`Nombre en bolsillo: ${pocket}`);
        } else {
          result.push(emb);
        }
      }
    });
  }

  // 2. Process services (where "Nombre en el bolsillo" is often stored)
  if (Array.isArray(item.services)) {
    item.services.forEach((srv: string) => {
      if (typeof srv === 'string') {
        const lower = srv.toLowerCase();
        if (lower.includes('bolsillo') || lower.includes('nombre')) {
          const label = pocket ? `Nombre en bolsillo: ${pocket}` : srv;
          if (!result.some(r => r.toLowerCase().includes('bolsillo'))) {
            result.push(label);
          }
        } else if (srv.toUpperCase().includes('LOGO')) {
          if (!result.some(r => r.toLowerCase() === srv.toLowerCase())) {
            result.push(srv);
          }
        }
      }
    });
  }

  // 3. Fallback: If pocketName exists but was not captured above
  if (pocket && !result.some(r => r.includes(pocket))) {
    result.push(`Nombre en bolsillo: ${pocket}`);
  }

  return result;
};
