const fs = require('fs');

// --- server.ts ---
let srv = fs.readFileSync('server.ts', 'utf8');
srv = srv.replace(/import type \{ DocumentData \} from 'firebase\/firestore';/, "import type { DocumentData } from 'firebase-admin/firestore';");
fs.writeFileSync('server.ts', srv);

// --- src/server/mcp.ts ---
let mcp = fs.readFileSync('src/server/mcp.ts', 'utf8');
mcp = mcp.replace(/import type \{ DocumentData \} from 'firebase\/firestore';/, "import type { DocumentData } from 'firebase-admin/firestore';");
fs.writeFileSync('src/server/mcp.ts', mcp);

// --- src/server/pulseService.ts ---
let pulse = fs.readFileSync('src/server/pulseService.ts', 'utf8');
pulse = pulse.replace(/import \{ db \} from '\.\.\/firebase';/, "import { db } from './adminDb';");
pulse = pulse.replace(/import \{ Firestore, .* \} from 'firebase\/firestore';/, "import type { DocumentData } from 'firebase-admin/firestore';");

// Convert Web SDK syntax to Admin SDK syntax
pulse = pulse.replace(/await getDocs\(collection\(db, '([^']+)'\)\)/g, "await db.collection('$1').get()");
pulse = pulse.replace(/await getDocs\(query\(collection\(db, '([^']+)'\), where\('([^']+)', '([^']+)', ([^)]+)\)\)\)/g, "await db.collection('$1').where('$2', '$3', $4).get()");
pulse = pulse.replace(/await updateDoc\(doc\(db, '([^']+)', ([^)]+)\), /g, "await db.collection('$1').doc($2).update(");
pulse = pulse.replace(/await deleteDoc\(doc\(db, '([^']+)', ([^)]+)\)\)/g, "await db.collection('$1').doc($2).delete()");
pulse = pulse.replace(/const batch = writeBatch\(db\);/g, "const batch = db.batch();");
pulse = pulse.replace(/batch\.delete\(doc\(db, '([^']+)', ([^)]+)\)\);/g, "batch.delete(db.collection('$1').doc($2));");
pulse = pulse.replace(/await getDocs\(query\(collection\(db, '([^']+)'\), orderBy\('([^']+)', '([^']+)'\), limit\(([^)]+)\)\)\)/g, "await db.collection('$1').orderBy('$2', '$3').limit($4).get()");

// Truncate file before handleActionCreateQuote
const createQuoteStart = pulse.indexOf('export async function handleActionCreateQuote(');
if (createQuoteStart !== -1) {
  pulse = pulse.substring(0, createQuoteStart);
}

// Append new handleActionCreateQuote
pulse += `export async function handleActionCreateQuote(quoteData: any) {
  const ordersSnap = await db.collection('orders').orderBy('id', 'desc').limit(1).get();
  
  let nextId = '#ORD-00026';
  if (!ordersSnap.empty) {
    const lastId = ordersSnap.docs[0].data().id;
    if (lastId && typeof lastId === 'string' && lastId.startsWith('#ORD-')) {
      const numPart = parseInt(lastId.substring(5), 10);
      if (!isNaN(numPart)) {
        nextId = \`#ORD-\${String(numPart + 1).padStart(5, '0')}\`;
      }
    }
  }

  const now = Date.now();
  const totalPrice = Number(quoteData.totalPrice) || 0;

  const newQuote = {
    orderId: nextId,
    id: nextId,
    customer: quoteData.customer,
    phone: quoteData.phone || '',
    email: quoteData.email || '',
    companyName: quoteData.companyName || 'Cliente Particular',
    items: quoteData.items || [],
    totalPrice: totalPrice,
    amountCollected: 0,
    balance: totalPrice,
    status: 'Cotización',
    docType: 'quote',
    category: 'Cotizaciones',
    notes: quoteData.notes || '',
    sellerName: quoteData.sellerName || 'Pablo Alvestegui',
    createdAt: now,
    updatedAt: now,
  };

  const newQuoteRef = db.collection('orders').doc();
  await newQuoteRef.set(newQuote);

  return { success: true, quoteId: nextId, documentId: newQuoteRef.id, message: "Quote created successfully", data: newQuote };
}
`;

fs.writeFileSync('src/server/pulseService.ts', pulse);
