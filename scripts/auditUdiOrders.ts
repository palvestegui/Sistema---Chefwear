import { db } from '../src/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

interface CanonicalUdiArchetype {
  canonicalName: string;
  authorizedFabric: string;
  contractPrice: number;
}

interface ItemDiscrepancy {
  itemIndex: number;
  recordedName: string;
  canonicalName: string;
  recordedFabric: string;
  canonicalFabric: string;
  chargedPrice: number;
  contractPrice: number;
  services: string[];
  discrepancies: string[];
}

interface OrderAuditResult {
  orderId: string;
  customerName: string;
  status: string;
  totalPrice: number;
  paymentMethod?: string;
  itemAudits: ItemDiscrepancy[];
  hasDiscrepancy: boolean;
  vectors: { naming: boolean; fabric: boolean; price: boolean; services: boolean };
}

async function runAudit() {
  console.log('================================================================================');
  console.log('            AZAFRÁN CHEFWEAR - UDI CONTRACT DIAGNOSTIC AUDIT (READ-ONLY)        ');
  console.log('================================================================================\n');

  // 1. Fetch Source of Truth from Firestore: pricing/global
  const pricingDocSnap = await getDoc(doc(db, 'pricing', 'global'));
  if (!pricingDocSnap.exists()) {
    console.error('CRITICAL: Document pricing/global not found in Firestore.');
    process.exit(1);
  }

  const pricingData = pricingDocSnap.data() as any;
  const udiPreset: Record<string, Record<string, number>> =
    pricingData.specialPresets?.['UDI Especial'] || pricingData.udiPricing || {};
  const servicesCatalog: Array<{ name: string; price: number }> = pricingData.services || [];
  const getServicePrice = (srv: string): number =>
    servicesCatalog.find((x) => x.name.trim().toLowerCase() === srv.trim().toLowerCase())?.price || 0;

  console.log('1. CANONICAL UDI CONTRACT SOURCE OF TRUTH (pricing.specialPresets["UDI Especial"]):');
  Object.entries(udiPreset).forEach(([garmentName, fabrics]) => {
    Object.entries(fabrics).forEach(([fabric, price]) => {
      console.log(`   • "${garmentName}" -> ${fabric} (Bs ${Number(price).toFixed(2)})`);
    });
  });
  console.log('   • Archetype Bundle: "Uniforme Completo UDI" (Sum of items = Bs 627.00)\n');

  const resolveArchetype = (name: string): CanonicalUdiArchetype | null => {
    const norm = (name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (norm.includes('uniforme completo')) {
      return { canonicalName: 'Uniforme Completo UDI', authorizedFabric: 'CONJUNTO COMPLETO', contractPrice: 627.0 };
    }
    const matchPreset = (term: string, defaultName: string, defaultFabric: string, defaultPrice: number) => {
      const canonicalKey = Object.keys(udiPreset).find((k) => k.toLowerCase().includes(term)) || defaultName;
      const fabrics = udiPreset[canonicalKey] || { [defaultFabric]: defaultPrice };
      const [fabric, price] = Object.entries(fabrics)[0] || [defaultFabric, defaultPrice];
      return { canonicalName: canonicalKey, authorizedFabric: fabric, contractPrice: Number(price) };
    };

    if (norm.includes('filipina') || norm.includes('chaqueta')) {
      return matchPreset('filipina', 'Filipina con logo UDI en el pecho y banderas en el cuello', 'Drill de 8oz', 253);
    }
    if (norm.includes('pantalon') || norm.includes('cargo') || norm.includes('buzo')) {
      return matchPreset('pantalon', 'Pantalón con 1 bolsillo cargo y logo UDI en la pierna', 'Drill de 8oz', 190);
    }
    if (norm.includes('mandil') || norm.includes('delantal')) {
      return matchPreset('mandil', 'Mandil con logo UDI en el bolsillo del pecho', 'Tornado (Bull Denim)', 149);
    }
    if (norm.includes('gorro') || norm.includes('cofia')) {
      return matchPreset('gorro', 'Gorro con logo UDI en la frente', 'Drill de 8oz', 35);
    }
    return null;
  };

  // 2. Query Orders
  const ordersSnap = await getDocs(collection(db, 'orders'));
  const udiOrders = ordersSnap.docs.filter((docSnap) => {
    const d = docSnap.data();
    return d.category === 'UDI' || d.clientType === 'Estudiante UDI' || d.pricingTier === 'UDI Especial' || d.accountId === 'ACC-001';
  });

  udiOrders.sort((a, b) => (a.data().id || a.id).localeCompare(b.data().id || b.id, undefined, { numeric: true, sensitivity: 'base' }));

  let totalNaming = 0, totalFabric = 0, totalPrice = 0, totalService = 0;
  const results: OrderAuditResult[] = [];

  for (const docSnap of udiOrders) {
    const order = docSnap.data();
    const rawId = order.id || docSnap.id;
    const orderId = rawId.startsWith('#') ? rawId : `#${rawId}`;
    const customer = (order.customer || `${order.customerFirstName || ''} ${order.customerLastName || ''}`).trim() || 'Sin Nombre';
    const status = order.status || 'Desconocido';
    const items = order.items || [];
    const totalPriceVal = Number(order.totalPrice || 0);

    const vectors = { naming: false, fabric: false, price: false, services: false };
    const itemAudits: ItemDiscrepancy[] = [];

    let orderContractBase = 0, orderServicesBase = 0;
    items.forEach((it: any) => {
      const arch = resolveArchetype(it.name);
      const qty = Number(it.qty) || 1;
      if (arch) orderContractBase += arch.contractPrice * qty;
      if (Array.isArray(it.services)) {
        it.services.forEach((s: string) => { orderServicesBase += getServicePrice(s) * qty; });
      }
    });

    const totalContractExpected = orderContractBase + orderServicesBase;

    items.forEach((item: any, idx: number) => {
      const archetype = resolveArchetype(item.name);
      if (!archetype) return;

      const recordedName = item.name || '';
      const recordedFabric = (item.fabric || '').trim();
      const qty = Number(item.qty) || 1;
      const services = Array.isArray(item.services) ? item.services : [];
      const itemServiceCost = services.reduce((acc: number, s: string) => acc + getServicePrice(s), 0);

      let chargedUnitPrice = 0;
      if (item.customUnitPrice !== undefined && item.customUnitPrice !== null && item.customUnitPrice !== '') {
        chargedUnitPrice = Number(item.customUnitPrice);
      } else if (item.unitPrice !== undefined && item.unitPrice !== null && item.unitPrice !== '') {
        chargedUnitPrice = Number(item.unitPrice);
      } else if (item.price !== undefined && item.price !== null && item.price !== '') {
        chargedUnitPrice = Number(item.price);
      } else if (items.length === 1 && totalPriceVal > 0) {
        chargedUnitPrice = (totalPriceVal - itemServiceCost * qty) / qty;
      } else if (totalContractExpected > 0 && totalPriceVal > 0) {
        chargedUnitPrice = archetype.contractPrice * (totalPriceVal / totalContractExpected);
      } else {
        chargedUnitPrice = archetype.contractPrice;
      }

      const discrepancies: string[] = [];

      // Vector 1: Naming
      if (recordedName !== archetype.canonicalName) {
        discrepancies.push(`Nombre Truncado ("${recordedName}" -> "${archetype.canonicalName}")`);
        vectors.naming = true;
        totalNaming++;
      }

      // Vector 2: Fabric
      if (archetype.canonicalName !== 'Uniforme Completo UDI' && recordedFabric.toLowerCase() !== archetype.authorizedFabric.toLowerCase()) {
        discrepancies.push(`Tela No Autorizada ("${recordedFabric || 'N/A'}" -> "${archetype.authorizedFabric}")`);
        vectors.fabric = true;
        totalFabric++;
      }

      // Vector 3: Price
      const diff = chargedUnitPrice - archetype.contractPrice;
      if (Math.abs(diff) > 0.5) {
        const diffLabel = diff > 0 ? `+Bs ${diff.toFixed(2)}` : `-Bs ${Math.abs(diff).toFixed(2)}`;
        discrepancies.push(`Precio Fuera de Contrato (Cobrado: Bs ${chargedUnitPrice.toFixed(2)} vs Contrato: Bs ${archetype.contractPrice.toFixed(2)} [${diffLabel}])`);
        vectors.price = true;
        totalPrice++;
      }

      // Vector 4: Services
      services.forEach((s: string) => {
        const sl = s.toLowerCase();
        if (sl.includes('tiros cruzados')) {
          discrepancies.push(`Servicio No Estándar: "${s}" (Canónico: "Correas cruzadas")`);
          vectors.services = true;
          totalService++;
        } else if (!sl.includes('correas cruzadas') && !sl.includes('nombre en el bolsillo')) {
          discrepancies.push(`Servicio Adicional No Contractual: "${s}"`);
          vectors.services = true;
          totalService++;
        }
      });

      itemAudits.push({
        itemIndex: idx + 1,
        recordedName,
        canonicalName: archetype.canonicalName,
        recordedFabric,
        canonicalFabric: archetype.authorizedFabric,
        chargedPrice: chargedUnitPrice,
        contractPrice: archetype.contractPrice,
        services,
        discrepancies,
      });
    });

    results.push({
      orderId,
      customerName: customer,
      status,
      paymentMethod: order.paymentMethod,
      totalPrice: totalPriceVal,
      itemAudits,
      hasDiscrepancy: vectors.naming || vectors.fabric || vectors.price || vectors.services,
      vectors,
    });
  }

  // 3. Print Report
  console.log('2. UDI ORDER SCAN METRICS & SUMMARY:');
  console.log(`   • Total UDI Orders Scanned:          ${udiOrders.length}`);
  console.log(`   • Orders with Discrepancies:         ${results.filter((r) => r.hasDiscrepancy).length}`);
  console.log(`   • Clean Fully-Compliant Orders:      ${results.filter((r) => !r.hasDiscrepancy).length}`);
  console.log('--------------------------------------------------------------------------------');
  console.log('   DISCREPANCIES GROUPED BY VECTOR:');
  console.log(`   • Vector 1 (Naming Truncation):      ${totalNaming} items flagged`);
  console.log(`   • Vector 2 (Fabric Discrepancy):     ${totalFabric} items flagged`);
  console.log(`   • Vector 3 (Price Discrepancy):      ${totalPrice} items flagged`);
  console.log(`   • Vector 4 (Services Discrepancy):   ${totalService} items flagged`);
  console.log('================================================================================\n');

  console.log('3. AUDIT INSPECTION BY ORDER:');
  results.forEach((res) => {
    if (!res.hasDiscrepancy) {
      console.log(`[CLEAN] ${res.orderId} | ${res.customerName} | Estado: ${res.status} | Total: Bs ${res.totalPrice.toFixed(2)}`);
      return;
    }
    console.log(`[FLAGGED] ${res.orderId} | ${res.customerName} | Estado: ${res.status} | Total: Bs ${res.totalPrice.toFixed(2)} | Modalidad: ${res.paymentMethod || 'N/A'}`);
    res.itemAudits.forEach((it) => {
      console.log(`  - Item ${it.itemIndex}:`);
      console.log(`    Nombre:    ${it.recordedName}  -->  Canónico: ${it.canonicalName}`);
      console.log(`    Tela:      ${it.recordedFabric || 'N/A'}  -->  Canónico: ${it.canonicalFabric}`);
      console.log(`    Precio:    Bs ${it.chargedPrice.toFixed(2)}  -->  Contrato: Bs ${it.contractPrice.toFixed(2)}`);
      if (it.services.length > 0) console.log(`    Servicios: [${it.services.join(', ')}]`);
      if (it.discrepancies.length > 0) console.log(`    🚨 Discrepancias: ${it.discrepancies.join(' | ')}`);
    });
    console.log('--------------------------------------------------------------------------------');
  });

  process.exit(0);
}

runAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
