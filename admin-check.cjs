const admin = require('firebase-admin');
const fs = require('fs');
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'ai-studio-0dba6e4d-b474-410e-b078-6e631bf1a01a'
  });
}
const db = admin.firestore();

async function check() {
  const qs = await db.collection('orders').limit(10).get();
  qs.forEach(doc => {
    console.log(doc.id, " => ", doc.data().migrationFlatDiscount, doc.data().subtotal, doc.data().totalPrice, doc.data().totalDiscount);
  });
}
check().catch(console.error);
