const fs = require('fs');

let pulse = fs.readFileSync('src/server/pulseService.ts', 'utf8');

const createQuoteStart = pulse.indexOf('export async function handleActionCreateQuote(');
if (createQuoteStart !== -1) {
  pulse = pulse.substring(0, createQuoteStart);
}

pulse += `export async function handleActionCreateQuote(quoteData: any) {
  // Clean up the test doc if present
  await db.collection('orders').doc('TqRQj6ZTKGykmMVt4bUK').delete().catch(() => {});

  const year = new Date().getFullYear();
  let nextId = \`COT-\${year}-0001\`;
  
  const quotesSnap = await db.collection('orders')
    .where('id', '>=', 'COT-')
    .where('id', '<=', 'COT-\\uf8ff')
    .orderBy('id', 'desc')
    .limit(1)
    .get();
  
  if (!quotesSnap.empty) {
    const lastId = quotesSnap.docs[0].data().id;
    if (lastId && typeof lastId === 'string' && lastId.startsWith(\`COT-\${year}-\`)) {
      const numPart = parseInt(lastId.substring(9), 10);
      if (!isNaN(numPart)) {
        nextId = \`COT-\${year}-\${String(numPart + 1).padStart(4, '0')}\`;
      }
    } else if (lastId && typeof lastId === 'string' && lastId.startsWith('COT-')) {
        // Fallback if they have COT-XXXX format without year
        const numPart = parseInt(lastId.substring(4), 10);
        if (!isNaN(numPart)) {
            nextId = \`COT-\${year}-\${String(numPart + 1).padStart(4, '0')}\`;
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
    docType: 'COTIZACION',
    category: 'Cotizaciones',
    notes: quoteData.notes || '',
    sellerName: quoteData.sellerName || 'Pablo Alvestegui',
    createdAt: now,
    updatedAt: now,
  };

  await db.collection('orders').doc(nextId).set(newQuote);

  return { success: true, quoteId: nextId, documentId: nextId, message: "Quote created successfully", data: newQuote };
}
`;

fs.writeFileSync('src/server/pulseService.ts', pulse);
