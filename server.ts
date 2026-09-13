import { setupMcpRoutes } from './src/server/mcp';
import {
  getSummaryData,
  getReportsData,
  getSellersData,
  getBottlenecksData,
  getOrdersData,
  getQuotesData,
  getDirectoryData,
  handleActionRevertOrder,
  handleActionDeleteQuote,
  handleActionMergeContacts,
  handleActionCreateQuote
} from './src/server/pulseService';
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
  items?: any[];
  client?: string;
  clientName?: string;
  contactPerson?: string;
  customer?: string;
  customerFirstName?: string;
  customerLastName?: string;
  fullName?: string;
  contactNombre?: string;
  productionStatus?: string;
  shippingDetails?: {
    city?: string;
  };
  deliveryCity?: string;
  createdAt?: string | number;
  date?: string;
  sellerName?: string;
  sellerEmail?: string;
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


async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

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
  });

  app.post('/api/action/:actionType', async (req, res) => {
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
      console.error(`Action Error [${actionType}]:`, error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  setupMcpRoutes(app, PULSE_KEY, firebaseConfig);

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
