import { db } from '../src/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { computeDiscountEngine } from '../src/utils/pricingCalculator';
import { resolveItemPrice } from '../src/utils/pricingResolver';

const CUTOVER_TIMESTAMP = 1789590991988; // September 16, 2026, 20:36:31 UTC-4

interface FailingItemDetail {
  name: string;
  fabric: string;
  qty: number;
  expectedPresetRate?: number;
  resolvedCatalogRate: number;
  failureReason: string;
}

interface FlaggedDiscrepancy {
  orderId: string;
  customer: string;
  createdAt: string;
  status: string;
  storedTotal: number;
  dynamicTotal: number;
  collected: number;
  storedBalance: number;
  dynamicBalance: number;
  totalDrift: number;
  balanceDistortion: number;
  failingItems: FailingItemDetail[];
}

async function runCutoverAudit() {
  console.log('================================================================================');
  console.log('      AZAFRÁN CHEFWEAR - CUTOVER DYNAMIC PRICING DRIFT AUDIT (READ-ONLY)        ');
  console.log(`      Cutover Benchmark: Sept 16, 2026 20:36:31 UTC-4 (${CUTOVER_TIMESTAMP})   `);
  console.log('================================================================================\n');

  // 1. Fetch current pricing configuration from Firestore
  const pricingSnap = await getDoc(doc(db, 'pricing', 'global'));
  if (!pricingSnap.exists()) {
    console.error('CRITICAL: pricing/global document does not exist in Firestore.');
    process.exit(1);
  }
  const pricing = pricingSnap.data() as Record<string, any>;
  const udiPreset: Record<string, Record<string, number>> =
    pricing.specialPresets?.['UDI Especial'] || pricing.udiPricing || {};

  // Helper to get service unit price dynamically
  const getServiceUnitPrice = (srvName: string, it: Record<string, any>): number => {
    if (it.customServicePrices && it.customServicePrices[srvName] !== undefined) {
      return Number(it.customServicePrices[srvName]) || 0;
    }
    const srvDef = (pricing.services || []).find(
      (x: { name: string; price: number }) => x.name.toLowerCase() === srvName.toLowerCase()
    );
    return srvDef?.price || 0;
  };

  // Helper to calculate raw item price dynamically
  const calcItemPriceRaw = (item: Record<string, any>, cat?: string, accId?: string): number => {
    const unitBase = resolveItemPrice(item, item.pricingTier || cat, pricing, accId || item?.accountId);
    const srvTotal = (item.services || []).reduce(
      (a: number, s: string) => a + getServiceUnitPrice(s, item),
      0
    );
    const customSrv = (item.embroideries || []).reduce((a: number, e: string) => {
      if (typeof e === 'string' && e.startsWith('Otro:')) {
        const parts = e.split('|');
        if (parts.length === 2) return a + parseFloat(parts[1]) || 0;
      }
      return a;
    }, 0);
    return (unitBase + srvTotal + customSrv) * (Number(item.qty) || 1);
  };

  // Helper to identify failing items on an order
  const inspectFailingItems = (order: Record<string, any>): FailingItemDetail[] => {
    const isUdi =
      order.category === 'UDI' ||
      order.clientType === 'Estudiante UDI' ||
      order.pricingTier === 'UDI Especial' ||
      order.accountId === 'ACC-001';

    const failing: FailingItemDetail[] = [];

    (order.items || []).forEach((it: Record<string, any>) => {
      const name = it.name || '';
      const fabric = it.fabric || '';
      const qty = Number(it.qty) || 1;
      const resolvedRate = resolveItemPrice(it, it.pricingTier || order.pricingTier || order.category, pricing, order.accountId);

      if (isUdi) {
        // Look up if this item matches a UDI contract archetype
        const norm = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const matchingPresetKey = Object.keys(udiPreset).find((k) => {
          const kn = k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (norm === 'filipina' && kn.includes('filipina')) return true;
          if (norm === 'pantalon' && kn.includes('pantalon')) return true;
          if (norm === 'mandil' && kn.includes('mandil')) return true;
          if (norm === 'gorro' && kn.includes('gorro')) return true;
          return false;
        });

        if (matchingPresetKey && name !== matchingPresetKey) {
          const expectedRate = Number(Object.values(udiPreset[matchingPresetKey] || {})[0]) || 0;
          if (Math.abs(resolvedRate - expectedRate) > 0.01) {
            failing.push({
              name,
              fabric,
              qty,
              expectedPresetRate: expectedRate,
              resolvedCatalogRate: resolvedRate,
              failureReason: `Truncated name "${name}" failed exact match against preset "${matchingPresetKey}". Fell back to standard catalog rate Bs ${resolvedRate.toFixed(2)} vs contract Bs ${expectedRate.toFixed(2)}.`,
            });
          }
        }
      } else if (resolvedRate === 0 && !it.customUnitPrice) {
        failing.push({
          name,
          fabric,
          qty,
          resolvedCatalogRate: 0,
          failureReason: `Custom / uncataloged garment "${name}" with fabric "${fabric}" resolved to Bs 0.00 in standard catalog.`,
        });
      }
    });

    return failing;
  };

  // 2. Fetch and evaluate orders
  const ordersSnap = await getDocs(collection(db, 'orders'));
  const allOrders: Array<Record<string, any>> = ordersSnap.docs.map((d) => ({
    ...(d.data() as Record<string, any>),
    _id: d.id,
  }));

  let historicalSettledCount = 0;
  let activeEvaluatedCount = 0;
  const flaggedDiscrepancies: FlaggedDiscrepancy[] = [];

  for (const order of allOrders) {
    const rawCreated = order.createdAt;
    const createdAtMs =
      typeof rawCreated === 'number'
        ? rawCreated
        : new Date(rawCreated).getTime() || 0;
    const createdAtIso =
      createdAtMs > 0 ? new Date(createdAtMs).toISOString() : 'Sin Fecha';

    const storedTotal = Number(order.totalPrice || 0);
    const collected = Number(order.amountCollected || 0);
    const storedBalance = Math.max(0, storedTotal - collected);

    // Step 1: Historical Settlement Isolation
    if (createdAtMs < CUTOVER_TIMESTAMP && storedBalance <= 0.01) {
      historicalSettledCount++;
      continue;
    }

    // Step 2: Post-Cutover Dynamic Drift Inspection
    activeEvaluatedCount++;

    const breakdown = computeDiscountEngine(
      order.items || [],
      order.pricingTier || order.category || order.clientType || 'Personal',
      order.paymentMethod || '50/50 - Adelantado/Entrega',
      Number(order.manualDiscount || 0),
      order.clientType,
      order.accountId,
      (it, cat, accId) => calcItemPriceRaw(it, cat, accId),
      {
        discountRulesByTier: pricing?.discountRulesByTier,
        specialPresetDiscounts: pricing?.specialPresetDiscounts,
      },
      Number(order.migrationFlatDiscount || 0),
      pricing?.services
    );

    const dynamicTotal = breakdown.total;
    const dynamicBalance = Math.max(0, dynamicTotal - collected);
    const totalDrift = Math.abs(storedTotal - dynamicTotal);
    const balanceDistortion = Math.abs(storedBalance - dynamicBalance);

    // Step 3: Flag Discrepancies
    if (totalDrift > 0.01 || balanceDistortion > 0.01) {
      const rawId = order.id || order._id;
      const orderId = rawId.startsWith('#') ? rawId : `#${rawId}`;
      const customer =
        (order.customer || `${order.customerFirstName || ''} ${order.customerLastName || ''}`).trim() ||
        'Sin Nombre';
      const failingItems = inspectFailingItems(order);

      flaggedDiscrepancies.push({
        orderId,
        customer,
        createdAt: createdAtIso,
        status: order.status || 'Desconocido',
        storedTotal,
        dynamicTotal,
        collected,
        storedBalance,
        dynamicBalance,
        totalDrift,
        balanceDistortion,
        failingItems,
      });
    }
  }

  // 3. Print Report
  console.log('AUDIT METRICS SUMMARY:');
  console.log(` • Total Orders Scanned in Database:          ${allOrders.length}`);
  console.log(` • Historical Settled Orders Safely Skipped:  ${historicalSettledCount}`);
  console.log(` • Active / Post-Cutover Orders Evaluated:     ${activeEvaluatedCount}`);
  console.log(` • Orders Flagged with Dynamic Pricing Drift:  ${flaggedDiscrepancies.length}`);
  console.log('================================================================================\n');

  console.log('FLAGGED DYNAMIC DRIFT ORDERS:');
  flaggedDiscrepancies.forEach((f) => {
    console.log(`⚠️  Order: ${f.orderId} | ${f.customer} | Fecha: ${f.createdAt} | Estado: ${f.status}`);
    console.log(`    Total Guardado:   Bs ${f.storedTotal.toFixed(2)}  -->  Total Dinámico:   Bs ${f.dynamicTotal.toFixed(2)}  (Drift: Bs ${f.totalDrift.toFixed(2)})`);
    console.log(`    Monto Cobrado:    Bs ${f.collected.toFixed(2)}`);
    console.log(`    Saldo Guardado:   Bs ${f.storedBalance.toFixed(2)}  -->  Saldo Dinámico:   Bs ${f.dynamicBalance.toFixed(2)}  (Distorsión: Bs ${f.balanceDistortion.toFixed(2)})`);
    if (f.failingItems.length > 0) {
      console.log('    Ítems con Falla de Resolución:');
      f.failingItems.forEach((it, idx) => {
        console.log(`      [${idx + 1}] "${it.name}" (${it.fabric}) x${it.qty}`);
        console.log(`          ${it.failureReason}`);
      });
    }
    console.log('--------------------------------------------------------------------------------');
  });

  process.exit(0);
}

runCutoverAudit().catch((err) => {
  console.error('Fatal cutover audit error:', err);
  process.exit(1);
});
