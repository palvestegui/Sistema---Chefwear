import { db } from '../src/firebase';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

async function fixOrderSalazarTypo() {
  console.log('=== STARTING HUGO SALAZAR TYPO FIX (ONE-TIME EXECUTION) ===\n');

  // Locate order #ORD-00001 (Hugo A. Salazar M.)
  const ordersSnap = await getDocs(collection(db, 'orders'));
  const targetDoc = ordersSnap.docs.find((d) => {
    const data = d.data();
    return (
      d.id === 'ORD-00001' ||
      d.id === '#ORD-00001' ||
      data.id === '#ORD-00001' ||
      data.id === 'ORD-00001' ||
      (data.customer && data.customer.toLowerCase().includes('hugo a. salazar'))
    );
  });

  if (!targetDoc) {
    console.error('CRITICAL: Order #ORD-00001 (Hugo A. Salazar M.) not found.');
    process.exit(1);
  }

  const orderData = targetDoc.data();
  console.log(`Found target order document: ID = "${targetDoc.id}"`);
  console.log(`Customer: ${orderData.customer}`);
  console.log(`Stored Total: Bs ${Number(orderData.totalPrice || 0).toFixed(2)}`);
  console.log(`Stored Collected: Bs ${Number(orderData.amountCollected || 0).toFixed(2)}`);

  const currentItems = orderData.items || [];
  let typoFound = false;

  const updatedItems = currentItems.map((item: Record<string, any>, idx: number) => {
    const rawName = item.name || '';
    if (rawName === 'Chamarra Ecuestre Personalizadoa' || rawName.includes('Personalizadoa')) {
      typoFound = true;
      console.log(`Item ${idx + 1}: Correcting typo "${rawName}" -> "Chamarra Ecuestre personalizada"`);
      return {
        ...item,
        name: 'Chamarra Ecuestre personalizada',
      };
    }
    return item;
  });

  if (!typoFound) {
    console.log('No typo found in items. Canonical name may already be in place.');
  } else {
    // Perform update on the document
    const docRef = doc(db, 'orders', targetDoc.id);
    await updateDoc(docRef, {
      items: updatedItems,
      updatedAt: Date.now(),
    });
    console.log('\nFirestore document successfully updated with canonical item names.');
  }

  // Verification step
  const refreshedSnap = await getDoc(doc(db, 'orders', targetDoc.id));
  const refreshedData = refreshedSnap.data() || {};
  const refreshedItems = refreshedData.items || [];

  const verifiedTotal = Number(refreshedData.totalPrice || 0);
  const verifiedCollected = Number(refreshedData.amountCollected || 0);
  const verifiedBalance = Math.max(0, verifiedTotal - verifiedCollected);

  console.log('\n=== VERIFICATION CONFIRMATION ===');
  console.log(`Document ID:     ${targetDoc.id}`);
  console.log(`Total Price:     Bs ${verifiedTotal.toFixed(2)} (Expected: Bs 1400.00)`);
  console.log(`Amount Collected: Bs ${verifiedCollected.toFixed(2)} (Expected: Bs 700.00)`);
  console.log(`Pending Balance:  Bs ${verifiedBalance.toFixed(2)} (Expected: Bs 700.00)`);
  console.log('Verified Items:');
  refreshedItems.forEach((it: Record<string, any>, i: number) => {
    console.log(` [${i + 1}] "${it.name}" | Tela: "${it.fabric}" | Qty: ${it.qty}`);
  });

  const isItemsValid = refreshedItems.every((it: Record<string, any>) => it.name === 'Chamarra Ecuestre personalizada');
  const isFinancialsValid = verifiedTotal === 1400 && verifiedCollected === 700 && verifiedBalance === 700;

  if (isItemsValid && isFinancialsValid) {
    console.log('\nSUCCESS: Order #ORD-00001 successfully repaired and verified.');
  } else {
    console.error('\nWARNING: Discrepancy detected during verification.');
  }

  process.exit(0);
}

fixOrderSalazarTypo().catch((err) => {
  console.error('Fatal error in fixOrderSalazarTypo:', err);
  process.exit(1);
});
