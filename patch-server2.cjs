const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const helpers = `
async function getSummaryData(db: FirebaseFirestore.Firestore) {
  const ordersSnap = await db.collection('orders').get();
  let totalActiveOrders = 0;
  let totalQuotes = 0;
  let totalAmountCollected = 0;
  let totalPendingBalance = 0;

  ordersSnap.docs.forEach((doc) => {
    const data = doc.data() as OrderData;
    const type = getDocType(data);
    const status = data.status || '';
    
    if (type === 'ORDEN' && !['Entregado', 'Cancelado', 'Anulado'].includes(status)) {
      totalActiveOrders++;
      const collected = Number(data.amountCollected) || 0;
      const total = Number(data.totalPrice) || 0;
      totalAmountCollected += collected;
      totalPendingBalance += Math.max(0, total - collected);
    } else if (type === 'COTIZACION' && !['Expirado', 'Cancelado'].includes(status)) {
      totalQuotes++;
    }
  });

  return { totalActiveOrders, totalQuotes, totalAmountCollected, totalPendingBalance, timestamp: Date.now() };
}

async function getReportsData(db: FirebaseFirestore.Firestore) {
  const ordersSnap = await db.collection('orders').get();
  let totalOrders = 0;
  let confirmedOrders = 0;
  let quoteCount = 0;
  let totalConfirmedRevenue = 0;
  let totalCollected = 0;
  let totalPendingBalance = 0;

  const garmentMap = new Map<string, { qty: number; revenue: number }>();
  const categoryMap = new Map<string, number>();

  ordersSnap.docs.forEach((doc) => {
    const data = doc.data() as OrderData;
    const type = getDocType(data);
    const status = data.status || '';
    
    if (type === 'ORDEN' && !['Cancelado', 'Anulado'].includes(status)) {
      totalOrders++;
      confirmedOrders++;
      const total = Number(data.totalPrice) || 0;
      const collected = Number(data.amountCollected) || 0;
      totalConfirmedRevenue += total;
      totalCollected += collected;
      totalPendingBalance += Math.max(0, total - collected);

      if (Array.isArray(data.items)) {
        data.items.forEach((i: any) => {
          const qty = Number(i.qty ?? i.quantity) || 1;
          const price = Number(i.price ?? i.unitPrice) || 0;
          const revenue = qty * price;
          const name = i.name ?? i.garmentName ?? i.title ?? 'Prenda';
          const cat = i.category ?? i.fabric ?? 'Sin categoría';

          if (!garmentMap.has(name)) {
            garmentMap.set(name, { qty: 0, revenue: 0 });
          }
          const g = garmentMap.get(name)!;
          g.qty += qty;
          g.revenue += revenue;

          categoryMap.set(cat, (categoryMap.get(cat) || 0) + revenue);
        });
      }
    } else if (type === 'COTIZACION' && !['Expirado', 'Cancelado'].includes(status)) {
      totalOrders++;
      quoteCount++;
    }
  });

  const topGarments = Array.from(garmentMap.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue);

  const categoryRevenue = Object.fromEntries(categoryMap.entries());

  return {
    totalOrders,
    confirmedOrders,
    quoteCount,
    totalConfirmedRevenue,
    totalCollected,
    totalPendingBalance,
    collectionRate: totalConfirmedRevenue > 0 ? (totalCollected / totalConfirmedRevenue) * 100 : 0,
    averageTicket: confirmedOrders > 0 ? totalConfirmedRevenue / confirmedOrders : 0,
    topGarments,
    categoryRevenue
  };
}

async function getSellersData(db: FirebaseFirestore.Firestore) {
  const ordersSnap = await db.collection('orders').get();
  const sellersMap = new Map<string, any>();

  ordersSnap.docs.forEach((doc) => {
    const data = doc.data() as OrderData;
    const type = getDocType(data);
    const status = data.status || '';
    const seller = data.sellerName || data.sellerEmail || 'Sin Asignar';

    if (!sellersMap.has(seller)) {
      sellersMap.set(seller, {
        sellerName: seller,
        totalQuotes: 0,
        confirmedOrders: 0,
        totalSalesRevenue: 0,
        totalAmountCollected: 0
      });
    }
    const s = sellersMap.get(seller)!;

    if (type === 'ORDEN' && !['Cancelado', 'Anulado'].includes(status)) {
      s.confirmedOrders++;
      s.totalSalesRevenue += Number(data.totalPrice) || 0;
      s.totalAmountCollected += Number(data.amountCollected) || 0;
    } else if (type === 'COTIZACION' && !['Expirado', 'Cancelado'].includes(status)) {
      s.totalQuotes++;
    }
  });

  return Array.from(sellersMap.values()).map(s => {
    const total = s.confirmedOrders + s.totalQuotes;
    return {
      ...s,
      conversionRate: total > 0 ? (s.confirmedOrders / total) * 100 : 0
    };
  });
}

async function getBottlenecksData(db: FirebaseFirestore.Firestore) {
  const ordersSnap = await db.collection('orders').get();
  const stalledMaterialOrders: any[] = [];
  const deliveryRiskOrders: any[] = [];
  const uncollectedBalanceOrders: any[] = [];
  const dataAnomalies: any[] = [];

  const now = Date.now();
  const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;
  const FIFTEEN_BUSINESS_DAYS_APPROX = 15 * 24 * 60 * 60 * 1000;

  ordersSnap.docs.forEach((doc) => {
    const data = doc.data() as OrderData;
    const type = getDocType(data);
    const status = data.status || '';

    if (type === 'ORDEN' && !['Entregado', 'Cancelado', 'Anulado'].includes(status)) {
      const customer = data.customer || [data.customerFirstName, data.customerLastName].filter(Boolean).join(' ') || data.clientName || data.fullName || data.contactNombre || 'Cliente';
      const total = Number(data.totalPrice) || 0;
      const collected = Number(data.amountCollected) || 0;
      const balance = total - collected;
      const createdAtMs = typeof data.createdAt === 'number' ? data.createdAt : (data.createdAt ? new Date(data.createdAt).getTime() : now);
      const timeSinceCreation = now - createdAtMs;

      const orderInfo = { orderId: doc.id, customer, status, productionStatus: data.productionStatus };

      if (status === 'Material Listo' && data.productionStatus === 'PENDING') {
        if (timeSinceCreation > FORTY_EIGHT_HOURS) {
          stalledMaterialOrders.push(orderInfo);
        }
      }

      if (timeSinceCreation > FIFTEEN_BUSINESS_DAYS_APPROX) {
        deliveryRiskOrders.push(orderInfo);
      }

      if (['Producido', 'Material Listo'].includes(status) && balance > 0) {
        uncollectedBalanceOrders.push({ ...orderInfo, balance });
      }

      if (collected > total) {
        dataAnomalies.push({ ...orderInfo, issue: 'Overcollected', total, collected });
      } else if (balance < 0) {
        dataAnomalies.push({ ...orderInfo, issue: 'Negative Balance', total, collected });
      }
    }
  });

  return {
    stalledMaterialOrders,
    deliveryRiskOrders,
    uncollectedBalanceOrders,
    dataAnomalies
  };
}

async function getOrdersData(db: FirebaseFirestore.Firestore) {
  const ordersSnap = await db.collection('orders').get();
  const activeOrders: Record<string, unknown>[] = [];
  
  ordersSnap.docs.forEach((doc) => {
    const data = doc.data() as OrderData;
    const type = getDocType(data);
    const status = data.status || '';
    
    if (type === 'ORDEN' && !['Entregado', 'Cancelado', 'Anulado'].includes(status)) {
      const collected = Number(data.amountCollected) || 0;
      const total = Number(data.totalPrice) || 0;
      const balance = Math.max(0, total - collected);
      
      const customer = data.customer || [data.customerFirstName, data.customerLastName].filter(Boolean).join(' ') || data.clientName || data.fullName || data.contactNombre || 'Cliente';
      const itemsSummary = Array.isArray(data.items) && data.items.length > 0
        ? data.items.map((i: any) => \`\${i.qty ?? i.quantity ?? 1}x \${i.name ?? i.garmentName ?? i.title ?? 'Prenda'}\`).join(', ')
        : 'Sin prendas';

      activeOrders.push({
        orderId: doc.id,
        customer,
        itemsSummary,
        status,
        productionStatus: data.productionStatus || 'PENDING',
        totalPrice: total,
        amountCollected: collected,
        balance,
        deliveryCity: data.shippingDetails?.city || data.deliveryCity || ''
      });
    }
  });
  
  return activeOrders;
}

async function getQuotesData(db: FirebaseFirestore.Firestore) {
  const ordersSnap = await db.collection('orders').get();
  const activeQuotes: Record<string, unknown>[] = [];
  
  ordersSnap.docs.forEach((doc) => {
    const data = doc.data() as OrderData;
    const type = getDocType(data);
    const status = data.status || '';
    
    if (type === 'COTIZACION' && !['Expirado', 'Cancelado'].includes(status)) {
      const customer = data.customer || [data.customerFirstName, data.customerLastName].filter(Boolean).join(' ') || data.clientName || data.fullName || data.contactNombre || 'Cliente';
      const itemsSummary = Array.isArray(data.items) && data.items.length > 0
        ? data.items.map((i: any) => \`\${i.qty ?? i.quantity ?? 1}x \${i.name ?? i.garmentName ?? i.title ?? 'Prenda'}\`).join(', ')
        : 'Sin prendas';

      activeQuotes.push({
        quoteId: doc.id,
        customer,
        itemsSummary,
        totalPrice: Number(data.totalPrice) || 0,
        createdAt: data.createdAt || data.date || null
      });
    }
  });
  
  return activeQuotes;
}

async function getDirectoryData(db: FirebaseFirestore.Firestore) {
  const contactsSnap = await db.collection('masterContacts').get();
  const accountsSnap = await db.collection('clientAccounts').get();
  
  const accountsMap = new Map<string, string>();
  accountsSnap.docs.forEach((doc) => {
    const d = doc.data() as AccountData;
    accountsMap.set(d.accountId || doc.id, d.companyName || d.accountName || '');
  });

  const directory: Record<string, unknown>[] = [];
  contactsSnap.docs.forEach((doc) => {
    const data = doc.data() as ContactData;
    const companyName = accountsMap.get(data.accountId || '') || '';
    
    directory.push({
      contactId: doc.id,
      fullName: data.fullName || \`\${data.contactNombre || ''} \${data.contactApellido || ''}\`.trim(),
      companyName,
      role: data.role || 'PARTICULAR',
      phone: data.phone || ''
    });
  });

  return directory;
}

async function handleActionRevertOrder(db: FirebaseFirestore.Firestore, orderId: string) {
  await db.collection('orders').doc(orderId).update({
    status: 'Cotización',
    docType: 'quote',
    updatedAt: Date.now()
  });
  return { success: true, orderId, message: "Order successfully reverted to quotation" };
}

async function handleActionDeleteQuote(db: FirebaseFirestore.Firestore, quoteId: string) {
  await db.collection('orders').doc(quoteId).delete();
  return { success: true, quoteId, message: "Quote removed successfully" };
}

async function handleActionMergeContacts(db: FirebaseFirestore.Firestore, sourceContactId: string, targetContactId: string) {
  const ordersSnap = await db.collection('orders').where('contactId', '==', sourceContactId).get();
  const batch = db.batch();

  ordersSnap.docs.forEach(doc => {
    batch.update(doc.ref, { contactId: targetContactId, updatedAt: Date.now() });
  });

  batch.delete(db.collection('masterContacts').doc(sourceContactId));

  await batch.commit();
  return { success: true, sourceContactId, targetContactId, message: "Contacts merged successfully" };
}

async function handleActionCreateQuote(db: FirebaseFirestore.Firestore, quoteData: any) {
  const newQuoteRef = db.collection('orders').doc();
  await newQuoteRef.set({
    ...quoteData,
    status: 'Cotización',
    docType: 'quote',
    createdAt: Date.now(),
    id: newQuoteRef.id
  });
  return { success: true, quoteId: newQuoteRef.id, message: "Quote created successfully" };
}
`;

const getPulseStrStart = \`app.get('/api/pulse', async (req, res) => {\`;
const getPulseStrEnd = \`      res.status(400).json({ error: 'Invalid entity' });
    } catch (error: unknown) {
      console.error("Pulse API Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });\`;

const postActionStrStart = \`app.post('/api/action/:actionType', async (req, res) => {\`;
const postActionStrEnd = \`      res.status(400).json({ error: 'Invalid action type' });
    } catch (error: unknown) {
      console.error(\\\`Action Error [\\\${actionType}]:\\\`, error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });\`;


const pulseReplacement = \`app.get('/api/pulse', async (req, res) => {
    const key = req.query['x-pulse-key'] || req.headers['x-pulse-key'];
    if (key !== PULSE_KEY) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!firebaseConfig || !firebaseConfig.firestoreDatabaseId) {
      res.status(500).json({ error: 'Firebase configuration not found on server' });
      return;
    }

    try {
      const db = getFirestore(firebaseConfig.firestoreDatabaseId);
      const entity = req.query.entity as string;

      if (entity === 'summary') {
        const data = await getSummaryData(db);
        res.json(data);
        return;
      }
      if (entity === 'reports') {
        const data = await getReportsData(db);
        res.json(data);
        return;
      }
      if (entity === 'sellers') {
        const data = await getSellersData(db);
        res.json(data);
        return;
      }
      if (entity === 'bottlenecks') {
        const data = await getBottlenecksData(db);
        res.json(data);
        return;
      }
      if (entity === 'orders') {
        const data = await getOrdersData(db);
        res.json(data);
        return;
      }
      if (entity === 'quotes') {
        const data = await getQuotesData(db);
        res.json(data);
        return;
      }
      if (entity === 'directory') {
        const data = await getDirectoryData(db);
        res.json(data);
        return;
      }
      res.status(400).json({ error: 'Invalid entity' });
    } catch (error: unknown) {
      console.error("Pulse API Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });\`;


const postActionReplacement = \`app.post('/api/action/:actionType', async (req, res) => {
    const key = req.query['x-pulse-key'] || req.headers['x-pulse-key'] || req.query.key;
    if (key !== PULSE_KEY) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!firebaseConfig || !firebaseConfig.firestoreDatabaseId) {
      res.status(500).json({ error: 'Firebase configuration not found on server' });
      return;
    }

    const actionType = req.params.actionType;
    const db = getFirestore(firebaseConfig.firestoreDatabaseId);

    try {
      if (actionType === 'revert-order') {
        const { orderId } = req.body;
        if (!orderId) {
          res.status(400).json({ error: 'orderId is required' });
          return;
        }
        const data = await handleActionRevertOrder(db, orderId);
        res.json(data);
        return;
      }

      if (actionType === 'delete-quote') {
        const { quoteId } = req.body;
        if (!quoteId) {
          res.status(400).json({ error: 'quoteId is required' });
          return;
        }
        const data = await handleActionDeleteQuote(db, quoteId);
        res.json(data);
        return;
      }

      if (actionType === 'merge-contacts') {
        const { sourceContactId, targetContactId } = req.body;
        if (!sourceContactId || !targetContactId) {
          res.status(400).json({ error: 'sourceContactId and targetContactId are required' });
          return;
        }
        const data = await handleActionMergeContacts(db, sourceContactId, targetContactId);
        res.json(data);
        return;
      }

      if (actionType === 'create-quote') {
        const quoteData = req.body;
        if (!quoteData || !quoteData.items || !quoteData.customer) {
          res.status(400).json({ error: 'customer and items are required' });
          return;
        }
        const data = await handleActionCreateQuote(db, quoteData);
        res.json(data);
        return;
      }

      res.status(400).json({ error: 'Invalid action type' });
    } catch (error: unknown) {
      console.error(\\\`Action Error [\\\${actionType}]:\\\`, error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });\`;


const mcpRoutes = \`
  app.get('/mcp', (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('text/event-stream')) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write(\\\`event: endpoint\\\\ndata: /mcp\\\\n\\\\n\\\`);
    } else {
      res.json({ status: "ok", protocol: "mcp", version: "2024-11-05", server: "azafran-erp" });
    }
  });

  app.post('/mcp', async (req, res) => {
    const { jsonrpc, id, method, params } = req.body;
    if (jsonrpc !== "2.0") {
      res.status(400).json({ error: "Invalid JSON-RPC version" });
      return;
    }

    const key = req.query['x-pulse-key'] || req.headers['x-pulse-key'] || req.query.key;
    if (key && key !== PULSE_KEY) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      if (method === "initialize") {
        res.json({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "azafran-erp", version: "1.0.0" }
          }
        });
        return;
      }

      if (method === "notifications/initialized") {
        res.status(200).send();
        return;
      }

      if (method === "tools/list") {
        res.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "azafran_get_summary",
                description: "Get high-level business pulse: active orders count, quote count, collected cash, and pending balances.",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "azafran_get_bottlenecks",
                description: "Scan active orders for workshop bottlenecks, delivery risks (>15 days), trapped receivables, and payment anomalies.",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "azafran_get_reports",
                description: "Get executive financial and garment demand analytics: gross revenue, average ticket, top garments, and collection efficiency.",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "azafran_get_sellers",
                description: "Get sales performance metrics, quote conversion rates, and revenue generated per seller.",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "azafran_get_orders",
                description: "List all active workshop production orders with client names, garments, stages, and balances.",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "azafran_get_quotes",
                description: "List all active quotations in the sales pipeline.",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "azafran_get_directory",
                description: "List all CRM directory contacts, company affiliations, and phone numbers.",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "azafran_create_quote",
                description: "Create a new quotation directly in the Azafrán ERP database.",
                inputSchema: {
                  type: "object",
                  properties: {
                    customer: { type: "string", description: "Full client name" },
                    phone: { type: "string" },
                    email: { type: "string" },
                    companyName: { type: "string" },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          qty: { type: "number" },
                          price: { type: "number" },
                          fabric: { type: "string" }
                        },
                        required: ["name", "qty", "price"]
                      }
                    },
                    totalPrice: { type: "number" },
                    notes: { type: "string" },
                    sellerName: { type: "string" }
                  },
                  required: ["customer", "items", "totalPrice"]
                }
              },
              {
                name: "azafran_revert_order",
                description: "Revert an accidental or premature order back into an editable quote.",
                inputSchema: {
                  type: "object",
                  properties: {
                    orderId: { type: "string", description: "The order ID (e.g., #ORD-00025)" }
                  },
                  required: ["orderId"]
                }
              },
              {
                name: "azafran_delete_quote",
                description: "Permanently delete or cancel a quotation by ID.",
                inputSchema: {
                  type: "object",
                  properties: {
                    quoteId: { type: "string", description: "The quote ID to delete" }
                  },
                  required: ["quoteId"]
                }
              },
              {
                name: "azafran_merge_contacts",
                description: "Merge a duplicate CRM contact into a master contact, reassigning all order histories.",
                inputSchema: {
                  type: "object",
                  properties: {
                    sourceContactId: { type: "string" },
                    targetContactId: { type: "string" }
                  },
                  required: ["sourceContactId", "targetContactId"]
                }
              }
            ]
          }
        });
        return;
      }

      if (method === "tools/call") {
        const toolName = params?.name;
        const args = params?.arguments || {};
        
        if (!firebaseConfig || !firebaseConfig.firestoreDatabaseId) {
          res.json({ jsonrpc: "2.0", id, error: { code: -32603, message: 'Firebase config missing' } });
          return;
        }
        const db = getFirestore(firebaseConfig.firestoreDatabaseId);

        let toolExecutionResult: any = null;

        if (toolName === "azafran_get_summary") {
          toolExecutionResult = await getSummaryData(db);
        } else if (toolName === "azafran_get_bottlenecks") {
          toolExecutionResult = await getBottlenecksData(db);
        } else if (toolName === "azafran_get_reports") {
          toolExecutionResult = await getReportsData(db);
        } else if (toolName === "azafran_get_sellers") {
          toolExecutionResult = await getSellersData(db);
        } else if (toolName === "azafran_get_orders") {
          toolExecutionResult = await getOrdersData(db);
        } else if (toolName === "azafran_get_quotes") {
          toolExecutionResult = await getQuotesData(db);
        } else if (toolName === "azafran_get_directory") {
          toolExecutionResult = await getDirectoryData(db);
        } else if (toolName === "azafran_create_quote") {
          toolExecutionResult = await handleActionCreateQuote(db, args);
        } else if (toolName === "azafran_revert_order") {
          toolExecutionResult = await handleActionRevertOrder(db, args.orderId);
        } else if (toolName === "azafran_delete_quote") {
          toolExecutionResult = await handleActionDeleteQuote(db, args.quoteId);
        } else if (toolName === "azafran_merge_contacts") {
          toolExecutionResult = await handleActionMergeContacts(db, args.sourceContactId, args.targetContactId);
        } else {
          res.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Tool not found" } });
          return;
        }

        res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              { type: "text", text: JSON.stringify(toolExecutionResult, null, 2) }
            ]
          }
        });
        return;
      }

      res.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
    } catch (err: any) {
      res.json({ jsonrpc: "2.0", id, error: { code: -32603, message: err.message } });
    }
  });
\`;

const getPulseStartIdx = content.indexOf(getPulseStrStart);
const getPulseEndIdx = content.indexOf(getPulseStrEnd) + getPulseStrEnd.length;
if (getPulseStartIdx !== -1 && getPulseEndIdx !== -1) {
  content = content.substring(0, getPulseStartIdx) + pulseReplacement + content.substring(getPulseEndIdx);
} else {
  console.error("Could not find get pulse block");
}

const postActionStartIdx = content.indexOf(postActionStrStart);
const postActionEndIdx = content.indexOf(postActionStrEnd) + postActionStrEnd.length;
if (postActionStartIdx !== -1 && postActionEndIdx !== -1) {
  content = content.substring(0, postActionStartIdx) + postActionReplacement + content.substring(postActionEndIdx);
} else {
  console.error("Could not find post action block");
}

// Insert helpers right before startServer()
content = content.replace('async function startServer()', helpers + '\\nasync function startServer()');
// Insert mcpRoutes before if (process.env.NODE_ENV !== "production") {
content = content.replace('  if (process.env.NODE_ENV !== "production") {', mcpRoutes + '\\n  if (process.env.NODE_ENV !== "production") {');

fs.writeFileSync('server.ts', content, 'utf8');
console.log('Patched server.ts');
