process.on('uncaughtException', (err: unknown) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './src/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { setupPulseRoutes } from './src/server/pulseRoutes';
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

export interface BundleSummary {
  activeOrdersCount: number;
  quotesCount: number;
  lastSyncedAt: string;
}

export interface OrderDocData {
  id: string;
  status?: string;
  docType?: string;
  [key: string]: unknown;
}

export interface AzafranBundlePayload {
  pricing: Record<string, unknown>;
  orders: OrderDocData[];
  quotes: OrderDocData[];
  summary: BundleSummary;
}

export async function getAzafranBundle(): Promise<AzafranBundlePayload> {
  const [pricingSnap, ordersSnap, quotesSnap] = await Promise.all([
    getDoc(doc(db, 'pricing', 'global')),
    getDocs(collection(db, 'orders')),
    getDocs(collection(db, 'quotes')).catch(() => null)
  ]);

  const pricing = pricingSnap.exists()
    ? (pricingSnap.data() as Record<string, unknown>)
    : {};

  const allOrderDocs: OrderDocData[] = ordersSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Record<string, unknown>)
  }));

  const activeOrders = allOrderDocs.filter((o) => {
    const status = String(o.status || '');
    if (status === 'Cancelado' || status === 'Anulado') return false;
    const docType = String(o.docType || '');
    const id = String(o.id || '');
    return !(docType === 'COTIZACION' || status === 'Cotización' || status === 'Estimado' || id.startsWith('COT-'));
  });

  const activeQuotes: OrderDocData[] = quotesSnap && quotesSnap.docs.length > 0
    ? quotesSnap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))
        .filter((q) => String(q.status || '') !== 'Cancelado')
    : allOrderDocs.filter((o) => {
        const s = String(o.status || '');
        const d = String(o.docType || '');
        const id = String(o.id || '');
        return s !== 'Cancelado' && (d === 'COTIZACION' || s === 'Cotización' || s === 'Estimado' || id.startsWith('COT-'));
      });

  return {
    pricing,
    orders: activeOrders,
    quotes: activeQuotes,
    summary: {
      activeOrdersCount: activeOrders.length,
      quotesCount: activeQuotes.length,
      lastSyncedAt: new Date().toISOString()
    }
  };
}

export const MCP_TOOLS = [
  { name: 'azafran_get_bundle', description: 'Unified status inspection of pricing catalog, active orders, and sales quotes.', inputSchema: { type: 'object', properties: {} } },
  { name: 'azafran_get_summary', description: 'Get high-level business pulse: active orders count, quote count, collected cash, and pending balances.', inputSchema: { type: 'object', properties: {} } },
  { name: 'azafran_get_bottlenecks', description: 'Scan active orders for workshop bottlenecks, delivery risks (>15 days), trapped receivables, and payment anomalies.', inputSchema: { type: 'object', properties: {} } },
  { name: 'azafran_get_reports', description: 'Get executive financial and garment demand analytics: gross revenue, average ticket, top garments, and collection efficiency.', inputSchema: { type: 'object', properties: {} } },
  { name: 'azafran_get_sellers', description: 'Get sales performance metrics, quote conversion rates, and revenue generated per seller.', inputSchema: { type: 'object', properties: {} } },
  { name: 'azafran_get_orders', description: 'List all active workshop production orders with client names, garments, stages, and balances.', inputSchema: { type: 'object', properties: {} } },
  { name: 'azafran_get_quotes', description: 'List all active quotations in the sales pipeline.', inputSchema: { type: 'object', properties: {} } },
  { name: 'azafran_get_directory', description: 'List all CRM directory contacts, company affiliations, and phone numbers.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'azafran_create_quote',
    description: 'Create a new quotation directly in the Azafrán ERP database.',
    inputSchema: {
      type: 'object',
      properties: {
        customer: { type: 'string', description: 'Full client name' },
        phone: { type: 'string' },
        email: { type: 'string' },
        companyName: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: { name: { type: 'string' }, qty: { type: 'number' }, price: { type: 'number' }, fabric: { type: 'string' } },
            required: ['name', 'qty', 'price']
          }
        },
        totalPrice: { type: 'number' },
        notes: { type: 'string' },
        sellerName: { type: 'string' }
      },
      required: ['customer', 'items', 'totalPrice']
    }
  },
  { name: 'azafran_revert_order', description: 'Revert an accidental or premature order back into an editable quote.', inputSchema: { type: 'object', properties: { orderId: { type: 'string', description: 'The order ID (e.g., #ORD-00025)' } }, required: ['orderId'] } },
  { name: 'azafran_delete_quote', description: 'Permanently delete or cancel a quotation by ID.', inputSchema: { type: 'object', properties: { quoteId: { type: 'string', description: 'The quote ID to delete' } }, required: ['quoteId'] } },
  { name: 'azafran_merge_contacts', description: 'Merge a duplicate CRM contact into a master contact, reassigning all order histories.', inputSchema: { type: 'object', properties: { sourceContactId: { type: 'string' }, targetContactId: { type: 'string' } }, required: ['sourceContactId', 'targetContactId'] } }
];

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  let firebaseConfig: Record<string, string> | null = null;
  try {
    firebaseConfig = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8')
    ) as Record<string, string>;
  } catch (e) {
    console.warn('Could not load firebase-applet-config.json');
  }

  const PULSE_KEY = process.env.AZAFRAN_PULSE_KEY || 'AZAFRAN_PULSE_2026';
  setupPulseRoutes(app, PULSE_KEY, firebaseConfig);

  app.get('/mcp', (req: Request, res: Response): void => {
    if (req.headers.accept && req.headers.accept.includes('text/event-stream')) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      });
      res.write('event: endpoint\ndata: /mcp\n\n');
    } else {
      res.json({ status: 'ok', protocol: 'mcp', version: '2024-11-05', server: 'azafran-erp' });
    }
  });

  app.post('/mcp', async (req: Request, res: Response): Promise<void> => {
    const { jsonrpc, id, method, params } = req.body as {
      jsonrpc?: string;
      id?: string | number | null;
      method?: string;
      params?: { name?: string; arguments?: Record<string, unknown> };
    };

    if (jsonrpc !== '2.0') {
      res.status(400).json({ error: 'Invalid JSON-RPC version' });
      return;
    }

    const key = (req.query['x-pulse-key'] || req.headers['x-pulse-key'] || req.query.key) as string | undefined;
    if (key && key !== PULSE_KEY) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      if (method === 'initialize') {
        res.json({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'azafran-erp', version: '1.0.0' }
          }
        });
        return;
      }

      if (method === 'notifications/initialized') {
        res.status(200).send();
        return;
      }

      if (method === 'tools/list') {
        res.json({ jsonrpc: '2.0', id, result: { tools: MCP_TOOLS } });
        return;
      }

      if (method === 'tools/call') {
        const toolName = params?.name || '';
        const args = (params?.arguments || {}) as Record<string, unknown>;

        const toolHandlers: Record<string, () => Promise<unknown>> = {
          azafran_get_bundle: () => getAzafranBundle(),
          azafran_get_summary: () => getSummaryData(),
          azafran_get_bottlenecks: () => getBottlenecksData(),
          azafran_get_reports: () => getReportsData(),
          azafran_get_sellers: () => getSellersData(),
          azafran_get_orders: () => getOrdersData(),
          azafran_get_quotes: () => getQuotesData(),
          azafran_get_directory: () => getDirectoryData(),
          azafran_create_quote: () => handleActionCreateQuote(args),
          azafran_revert_order: () => handleActionRevertOrder(String(args.orderId || '')),
          azafran_delete_quote: () => handleActionDeleteQuote(String(args.quoteId || '')),
          azafran_merge_contacts: () => handleActionMergeContacts(String(args.sourceContactId || ''), String(args.targetContactId || ''))
        };

        const handler = toolHandlers[toolName];
        if (!handler) {
          res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Tool not found' } });
          return;
        }

        const result = await handler();
        res.json({
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
        });
        return;
      }

      res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal error';
      res.json({ jsonrpc: '2.0', id, error: { code: -32603, message } });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
