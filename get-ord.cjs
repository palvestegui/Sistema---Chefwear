const admin = require('firebase-admin');
const fs = require('fs');
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'ai-studio-0dba6e4d-b474-410e-b078-6e631bf1a01a'
  });
}
const db = admin.firestore();
async function check() {
  const doc = await db.collection('orders').doc('ORD-00003').get();
  console.log(doc.data());
}
check().catch(console.error);
