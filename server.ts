import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, DocumentData } from 'firebase-admin/firestore';
import fs from 'fs';

interface OrderItem {
  quantity: number;
  type: string;
}

interface OrderData extends DocumentData {
  docType?: string;
  status?: string;
  id?: string;
  amountCollected?: string | number;
  totalPrice?: string | number;
  items?: OrderItem[];
  client?: string;
  clientName?: string;
  contactPerson?: string;
  productionStatus?: string;
  shippingDetails?: {
    city?: string;
  };
  deliveryCity?: string;
  createdAt?: string;
  date?: string;
}

interface ContactData extends DocumentData {
  accountId?: string;
  fullName?: string;
  contactNombre?: string;
  contactApellido?: string;
  role?: string;
  phone?: string;
}

interface AccountData extends DocumentData {
  accountId?: string;
  companyName?: string;
  accountName?: string;
}

// Helper to determine order/quote
const getDocType = (o: OrderData) => 
  o.docType || (o.status === 'Cotización' || o.status === 'Estimado' || o.id?.startsWith('COT-') ? 'COTIZACION' : 'ORDEN');

async function startServer() {
  const app = express();
  const PORT = 3000;

  // We define it as a basic Record to allow checking properties safely
  let firebaseConfig: Record<string, string> | null = null;
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8')) as Record<string, string>;
  } catch (e) {
    console.warn("Could not load firebase-applet-config.json");
  }

  if (!getApps().length && firebaseConfig && typeof firebaseConfig.projectId === 'string') {
    initializeApp({ projectId: firebaseConfig.projectId });
  }

  const PULSE_KEY = process.env.AZAFRAN_PULSE_KEY || 'AZAFRAN_PULSE_2026';

  app.get('/api/pulse', async (req, res) => {
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

        res.json({ 
          totalActiveOrders, 
          totalQuotes, 
          totalAmountCollected, 
          totalPendingBalance, 
          timestamp: Date.now() 
        });
        return;
      }

      if (entity === 'orders') {
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
            
            const items = Array.isArray(data.items) ? data.items : [];
            const itemsSummary = items.map(i => `${i.quantity}x ${i.type}`).join(', ');

            activeOrders.push({
              orderId: doc.id,
              customer: data.client || data.clientName || data.contactPerson || 'Unknown',
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
        
        res.json(activeOrders);
        return;
      }

      if (entity === 'quotes') {
        const ordersSnap = await db.collection('orders').get();
        const activeQuotes: Record<string, unknown>[] = [];
        
        ordersSnap.docs.forEach((doc) => {
          const data = doc.data() as OrderData;
          const type = getDocType(data);
          const status = data.status || '';
          
          if (type === 'COTIZACION' && !['Expirado', 'Cancelado'].includes(status)) {
            const items = Array.isArray(data.items) ? data.items : [];
            const itemsSummary = items.map(i => `${i.quantity}x ${i.type}`).join(', ');

            activeQuotes.push({
              quoteId: doc.id,
              customer: data.client || data.clientName || data.contactPerson || 'Unknown',
              itemsSummary,
              totalPrice: Number(data.totalPrice) || 0,
              createdAt: data.createdAt || data.date || null
            });
          }
        });
        
        res.json(activeQuotes);
        return;
      }

      if (entity === 'directory') {
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
            fullName: data.fullName || `${data.contactNombre || ''} ${data.contactApellido || ''}`.trim(),
            companyName,
            role: data.role || 'PARTICULAR',
            phone: data.phone || ''
          });
        });

        res.json(directory);
        return;
      }

      res.status(400).json({ error: 'Invalid entity' });
    } catch (error: unknown) {
      console.error("Pulse API Error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
